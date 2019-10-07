import { Message, formDataConfig, defaultNetworkConfig, DEFAULT_FEES, FEE_GROUPS } from "@/config/index.ts"
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { EmptyAlias } from "nem2-sdk/dist/src/model/namespace/EmptyAlias"
import { Address, AliasAction, NamespaceId, Password, Transaction, MosaicId, AddressAliasTransaction, Deadline, UInt64, MosaicAliasTransaction } from "nem2-sdk"
import { mapState } from "vuex"
import { networkConfig } from "@/config/index"
import { getAbsoluteMosaicAmount } from "@/core/utils"
import { StoreAccount, AppInfo, AppWallet, AppNamespace, AppMosaic, DefaultFee, MosaicNamespaceStatusType } from "@/core/model"
import { AppMosaics } from '@/core/services'

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app'
    })
  }
})
export class AliasTs extends Vue {
  activeAccount: StoreAccount
  app: AppInfo
  isCompleteForm = true
  formItems = formDataConfig.alias
  bindTypes: Record<string, string> = {
      address: 'address',
      mosaic: 'mosaic',
  }
  bindType: string = this.getBindType
  /**
   * The namespace name
   */
  alias: string = this.getAlias
  /**
   * The address or the mosaic hex Id
   */
  target: string = this.getTarget
  namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration

  @Prop() visible: boolean

  /**
   * True for binding, false for unbinding
   */
  @Prop({ required: true }) bind: boolean

  /**
   * Is the prop spawned from a click on a namespace?
   */
  @Prop({ required: true }) fromNamespace: boolean
  @Prop({ default: null }) namespace: AppNamespace
  @Prop({ default: null }) mosaic: string
  @Prop({ default: null }) address: string

  get show(): boolean {
      return this.visible
  }

  set show(val) {
      if (!val) {
          this.$emit('close')
      }
  }

  get getTarget(): string {
      const { mosaic, address } = this
      if (address) return address
      if (mosaic) return mosaic
      return null
  }

  set getTarget(val: string) {
      this.target = val
  }

  get getAlias(): string {
      const { bind, fromNamespace, namespace } = this
      if (fromNamespace) return namespace.name
      if (!bind) return namespace.name
      return null
  }

  set getAlias(val: string) {
      this.alias = val
  }

  get restrictedBindType(): boolean {
      const {fromNamespace, bind} = this
      if (!fromNamespace && bind) return true
      if (!bind) return true
      return false
  }

  get getBindType(): string {
      const { fromNamespace, bind, address, mosaic, bindTypes } = this
      if (fromNamespace && bind) return bindTypes.address
      if (mosaic) return bindTypes.mosaic
      if (address) return bindTypes.address
  }

  set getBindType(val: string) {
      this.bindType = val
  }

  get aliasAction(): AliasAction {
      return this.bind ? AliasAction.Link : AliasAction.Unlink
  }

  get wallet(): AppWallet {
      return this.activeAccount.wallet
  }

  get networkCurrency() {
      return this.activeAccount.networkCurrency
  }

  get NamespaceList(): AppNamespace[] {
      return this.activeAccount.namespaces
  }

  get currentHeight(): number {
      return this.app.chainStatus.currentHeight
  }

  get defaultFees(): DefaultFee[] {
    return DEFAULT_FEES[FEE_GROUPS.DOUBLE]
  }

  get feeAmount(): number {
    const { feeSpeed } = this.formItems
    const feeAmount = this.defaultFees.find(({ speed }) => feeSpeed === speed).value
    return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
  }

  get linkableMosaics(): string[] {
      const {currentHeight} = this
      const {address} = this.wallet
      const availableToBeLinked = AppMosaics()
          .getAvailableToBeLinked(currentHeight, address, this.$store)
      if (!availableToBeLinked.length) return []
      return availableToBeLinked
          .filter((item) => currentHeight < item.expirationHeight || item.expirationHeight == MosaicNamespaceStatusType.FOREVER)
          .map(({hex}) => hex)
  }

  get linkableNamespaces(): string[] {
      const {currentHeight, namespaceGracePeriodDuration} = this
      // @TODO handle namespace list loading state
      return this.NamespaceList
          .filter(({alias, endHeight}) => (alias instanceof EmptyAlias
              && endHeight - currentHeight > namespaceGracePeriodDuration))
          .map(({name}) => name)
  }

  checkForm(): boolean {
      const { target, alias } = this
      const { password } = this.formItems

      
      if (!target && !(alias || alias.trim())) {
        this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
        return false
      }
      if (!(password || password.trim())) {
        this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
        return false
      }
      if (password.length < 8) {
        this.showErrorMessage(this.$t('password_error') + '')
        return false
      }

      const validPassword = new AppWallet(this.wallet)
          .checkPassword(new Password(password))

      if (!validPassword) {
        this.showErrorMessage(this.$t('password_error') + '')
        return false
      }
      return true
  }

  showErrorMessage(message) {
    this.$Notice.destroy()
    this.$Notice.error({
      title: message
    })
  }

  submit() {
    if (!this.isCompleteForm) return
    if (!this.checkForm()) return
    this.signAndAnnounce(this.transaction())
  }

  transaction(): Transaction {
    const { alias, feeAmount, bindType, bindTypes, aliasAction, target } = this
    const { networkType } = this.wallet

    return bindType === bindTypes.address
        ? AddressAliasTransaction.create(
            Deadline.create(),
            aliasAction,
            new NamespaceId(alias),
            Address.createFromRawAddress(target),
            networkType,
            UInt64.fromUint(feeAmount),
        )
        : MosaicAliasTransaction.create(
            Deadline.create(),
            aliasAction,
            new NamespaceId(alias),
            new MosaicId(target),
            networkType,
            UInt64.fromUint(feeAmount),
        )
  }

  signAndAnnounce(transaction: Transaction): void {
    const {node, generationHash} = this.activeAccount
    const {password} = this.formItems
    new AppWallet(this.wallet).signAndAnnounceNormal( new Password(password),
                                                      node,
                                                      generationHash,
                                                      [transaction],
                                                      this)
    this.show = false
  }
}
