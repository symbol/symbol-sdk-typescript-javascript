import {formDataConfig, DEFAULT_FEES, FEE_GROUPS} from "@/config/index.ts"
import {Component, Prop, Vue, Provide} from 'vue-property-decorator'
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
import {StoreAccount, AppInfo, AppWallet, AppNamespace, DefaultFee, MosaicNamespaceStatusType, BindTypes} from "@/core/model"
import {AppMosaics, signAndAnnounce} from '@/core/services'
import {validation} from '@/core/validation'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    components: {DisabledForms, ErrorTooltip}
})

export class AliasTs extends Vue {
    @Provide() validator: any = this.$validator
    BindTypes = BindTypes
    signAndAnnounce = signAndAnnounce
    activeAccount: StoreAccount
    app: AppInfo
    validation = validation
    formItems = cloneData(formDataConfig.alias)
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

    get currentAccount() {
        return this.activeAccount.currentAccount
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
        const {fromNamespace, bind, address, mosaic} = this
        if (fromNamespace && bind) return BindTypes.ADDRESS
        if (mosaic) return BindTypes.MOSAIC
        if (address) return BindTypes.ADDRESS
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
        return this.app.NetworkProperties.height
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

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.confirmViaTransactionConfirmation()
            })
    }

    transaction(): Transaction {
        const {alias, feeAmount, bindType, aliasAction, target} = this
        const {networkType} = this.wallet

        return bindType === BindTypes.ADDRESS
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

    confirmViaTransactionConfirmation() {
        try {
            this.show = false;

            this.signAndAnnounce({
                transaction: this.transaction(),
                store: this.$store,
            })
        } catch (error) {
            console.error("AliasTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }
}
