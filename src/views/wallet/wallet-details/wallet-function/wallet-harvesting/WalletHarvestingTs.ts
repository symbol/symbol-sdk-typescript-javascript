import {Message} from "@/config/index.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {AccountLinkTransaction, UInt64, LinkAction, Deadline, Password} from "nem2-sdk"
import {AccountApiRxjs} from "@/core/api/AccountApiRxjs.ts"
import {mapState} from "vuex"
import {getAbsoluteMosaicAmount} from '@/core/utils'
import {formDataConfig} from "@/config/view/form";
import {AppWallet, DefaultFee, StoreAccount} from "@/core/model"
import {DEFAULT_FEES, FEE_GROUPS} from "@/config/index";

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
    })
  }
})
export class WalletHarvestingTs extends Vue {
  activeAccount: StoreAccount
  harvestBlockList = []
  isLinkToRemote = false
  isShowDialog = false
  formItems = formDataConfig.remoteForm
  remotePublicKey: string = null

  get wallet() {
    return this.activeAccount.wallet
  }

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  get generationHash() {
    return this.activeAccount.generationHash
  }

  get defaultFees(): DefaultFee[] {
    return DEFAULT_FEES[FEE_GROUPS.SINGLE]
  }

  get node() {
    return this.activeAccount.node
  }

  get networkType() {
    return this.activeAccount.wallet.networkType
  }

  get feeAmount(): number {
      const {feeSpeed} = this.formItems
      const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
      return getAbsoluteMosaicAmount(feeAmount, this.activeAccount.networkCurrency.divisibility)
  }

  get address() {
    return this.activeAccount.wallet.address
  }
  
  // @TODO: refactor harvesting: move to store
  async getRemotePublicKey(): Promise<void> {
      try {
          const {address, node} = this
          const resStr: any = await new AccountApiRxjs().getLinkedPublickey(node, address).toPromise()

      if (JSON.parse(resStr) && JSON.parse(resStr).account && JSON.parse(resStr).account.linkedAccountKey) {
          const {linkedAccountKey} = JSON.parse(resStr).account
          const publicKey = Buffer.from(linkedAccountKey, 'base64').toString('hex').toUpperCase()
          this.remotePublicKey = Number(publicKey) !== 0 ? publicKey : null 
          return
      }
          this.remotePublicKey = null
      } catch (error) {
          console.error(error)
          this.remotePublicKey = null
      }
  }

  get isLinked(): boolean {
      return this.remotePublicKey !== null
  }

  initForm() {
    this.formItems = formDataConfig.remoteForm
  }

  modalCancel() {
    this.isShowDialog = false
  }

  switchChan() {
    if (this.isLinked == false) {
      this.isShowDialog = true
    }
  }

  showErrorMessage(message: string) {
    this.$Notice.destroy()
    this.$Notice.error({
      title: message
    })
  }

  checkForm(): boolean {
    const {remotePublicKey} = this
    const {password} = this.formItems
    const {feeAmount} = this
    if (remotePublicKey.length !== 64) {
      this.showErrorMessage(this.$t(Message.ILLEGAL_PUBLICKEY_ERROR) + '')
      return false
    }
    if ((!Number(feeAmount) && Number(feeAmount) !== 0) || Number(feeAmount) < 0) {
      this.showErrorMessage(this.$t(Message.FEE_LESS_THAN_0_ERROR) + '')
      return false
    }
    if (!password || password.trim() == '') {
      this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
      return false
    }

    if (password.length < 8) {
      this.showErrorMessage(this.$t('password_error') + '')
      return false
    }

    const validPassword = new AppWallet(this.wallet).checkPassword(new Password(password))

    if (!validPassword) {
      this.showErrorMessage(this.$t('password_error') + '')
      return false
    }
    return true
  }

  confirmInput() {
    if (!this.checkForm()) return
    this.sendTransaction()
  }

  sendTransaction() {
    const {feeAmount, remotePublicKey} = this
    const {password} = this.formItems
    const {generationHash, node, networkType, isLinked} = this
    const accountLinkTransaction = AccountLinkTransaction.create(
      Deadline.create(),
      remotePublicKey,
      isLinked ? LinkAction.Unlink : LinkAction.Link,
      networkType,
      UInt64.fromUint(feeAmount)
    )
    new AppWallet(this.wallet).signAndAnnounceNormal(new Password(password), node, generationHash, [accountLinkTransaction], this)
    this.modalCancel()
  }

  toggleSwitch(status) {
    this.isShowDialog = true
  }

  // @TODO: refactor harvesting: move to store
  mounted() { this.getRemotePublicKey() }

  // @TODO: refactor harvesting: move to store
  @Watch('address')
  onAddressChange(newVal, oldVal) {
      if (newVal && newVal !== oldVal) {
          this.getRemotePublicKey() 
      }
  }
}
