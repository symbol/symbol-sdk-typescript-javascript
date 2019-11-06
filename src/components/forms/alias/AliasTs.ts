import {Message, formDataConfig, DEFAULT_FEES, FEE_GROUPS} from "@/config/index.ts"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {
    Address,
    AliasAction,
    NamespaceId,
    Transaction,
    MosaicId,
    AddressAliasTransaction,
    Deadline,
    UInt64,
    MosaicAliasTransaction,
    EmptyAlias
} from "nem2-sdk"
import {mapState} from "vuex"
import {cloneData, getAbsoluteMosaicAmount} from "@/core/utils"
import {StoreAccount, AppInfo, AppWallet, AppNamespace, DefaultFee, MosaicNamespaceStatusType} from "@/core/model"
import {AppMosaics, signTransaction} from '@/core/services'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'

@Component({
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app'
    })
  },
  components:{ DisabledForms }
})

export class AliasTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    formItems = cloneData(formDataConfig.alias)
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

    @Prop() visible: boolean

    /**
     * True for binding, false for unbinding
     */
    @Prop({required: true}) bind: boolean

    /**
     * Is the prop spawned from a click on a namespace?
     */
    @Prop({required: true}) fromNamespace: boolean
    @Prop({default: null}) namespace: AppNamespace
    @Prop({default: null}) mosaic: string
    @Prop({default: null}) address: string

    get show(): boolean {
        return this.visible
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get getTarget(): string {
        const {mosaic, address} = this
        if (address) return address
        if (mosaic) return mosaic
        return null
    }

    set getTarget(val: string) {
        this.target = val
    }

    get getAlias(): string {
        const {bind, fromNamespace, namespace} = this
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
        const {fromNamespace, bind, address, mosaic, bindTypes} = this
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
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
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
        const {currentHeight} = this
        // @TODO handle namespace list loading state
        return this.NamespaceList
            .filter((namespace: AppNamespace) => {
                return namespace.alias instanceof EmptyAlias
                    && !namespace.expirationInfo(currentHeight).expired
            })
            .map(({name}) => name)
    }

    checkForm(): boolean {
        const {target, alias, bindTypes, bindType} = this

        if (bindType == bindTypes.address) {
            try {
                Address.createFromRawAddress(target)
            } catch (e) {
                this.showErrorMessage(this.$t(Message.ADDRESS_FORMAT_ERROR) + '')
                return false
            }
        }
        if (bindType == bindTypes.mosaic) {
            try {
                new MosaicId(target)
            } catch (e) {
                this.showErrorMessage(this.$t(Message.MOSAIC_HEX_FORMAT_ERROR) + '')
                return false
            }
        }

        if (!target && !(alias || alias.trim())) {
            this.showErrorMessage(this.$t(Message.INPUT_EMPTY_ERROR) + '')
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
        if (!this.checkForm()) return
        this.confirmViaTransactionConfirmation()
    }

    transaction(): Transaction {
        const {alias, feeAmount, bindType, bindTypes, aliasAction, target} = this
        const {networkType} = this.wallet

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

    async confirmViaTransactionConfirmation() {
        try {
            this.show = false;

            const {
                success,
                signedTransaction,
                signedLock,
            } = await signTransaction({
                transaction: this.transaction(),
                store: this.$store,
            })
            
            if(success) {
                new AppWallet(this.wallet).announceTransaction(signedTransaction, this.activeAccount.node, this.$root, signedLock)
            }            
        } catch (error) {
            console.error("AliasTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }
}
