import {mapState} from "vuex"
import {
    Address, PublicAccount, MultisigAccountInfo, NetworkType,
    NamespaceRegistrationTransaction, Deadline, UInt64
} from "nem2-sdk"
import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {networkConfig, formDataConfig, DEFAULT_FEES, FEE_GROUPS} from "@/config"
import {getAbsoluteMosaicAmount, formatAddress, cloneData} from '@/core/utils'
import {AppNamespace, StoreAccount, AppInfo, AppWallet, DefaultFee, LockParams} from "@/core/model"
import {createBondedMultisigTransaction, createCompleteMultisigTransaction, signTransaction} from '@/core/services'
import {standardFields} from "@/core/validation"
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
@Component({
    components: {
        DisabledForms,
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class SubNamespaceTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    transactionList = []
    formItems = cloneData(formDataConfig.subNamespaceForm)
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    formatAddress = formatAddress
    standardFields = standardFields

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get activeMultisigAccount(): string {
        return this.activeAccount.activeMultisigAccount
    }

    get activeMultisigAddress(): string {
        const {activeMultisigAccount} = this.activeAccount
        return activeMultisigAccount
            ? Address.createFromPublicKey(activeMultisigAccount, this.wallet.networkType).plain()
            : null
    }

    get announceInLock(): boolean {
        const {activeMultisigAccount, networkType} = this
        if (!this.activeMultisigAccount) return false
        const address = Address.createFromPublicKey(activeMultisigAccount, networkType).plain()
        return this.activeAccount.multisigAccountInfo[address] && this.activeAccount.multisigAccountInfo[address].minApproval > 1
    }

    get multisigInfo(): MultisigAccountInfo {
        const {address} = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get hasMultisigAccounts(): boolean {
        if (!this.multisigInfo) return false
        return this.multisigInfo.multisigAccounts.length > 0
    }

    get multisigPublicKeyList(): { publicKey: string, address: string }[] {
        if (!this.hasMultisigAccounts) return null
        return [
            {
                publicKey: this.accountPublicKey,
                address: `(self) ${formatAddress(this.address)}`,
            },
            ...this.multisigInfo.multisigAccounts
                .map(({publicKey}) => ({
                    publicKey,
                    address: formatAddress(Address.createFromPublicKey(publicKey, this.networkType).plain())
                })),
        ]
    }

    get address(): string {
        return this.activeAccount.wallet.address
    }

    get networkType(): NetworkType {
        return this.activeAccount.wallet.networkType
    }

    get currentHeight(): number {
        return this.app.chainStatus.currentHeight
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get accountPublicKey(): string {
        return this.activeAccount.wallet.publicKey
    }

    get multisigAccountInfo(): MultisigAccountInfo {
        return this.activeAccount.multisigAccountInfo[this.wallet.address]
    }

    get multisigAccounts(): PublicAccount[] {
        return this.multisigAccountInfo ? this.multisigAccountInfo.multisigAccounts : []
    }

    get namespaceList(): { label: string, value: string }[] {
        const {currentHeight, namespaceGracePeriodDuration} = this
        const {namespaces} = this.activeAccount
        if (!namespaces) return []

        // @TODO: refactor and make it an AppNamespace method
        return namespaces
            .filter(namespace => namespace.alias)
            .filter(({endHeight, levels}) => (levels < networkConfig.maxNamespaceDepth
                && endHeight - currentHeight + namespaceGracePeriodDuration > 0))
            .map(alias => ({label: alias.name, value: alias.name}))       
    }

    get multisigNamespaceList(): { label: string, value: string }[] {
        const {currentHeight, namespaceGracePeriodDuration, activeMultisigAddress} = this
        if (!activeMultisigAddress) return []
        const namespaces: AppNamespace[] = this.activeAccount.multisigAccountsNamespaces[activeMultisigAddress]
        if (!namespaces) return []

        // @TODO: refactor and make it an AppNamespace method
        return namespaces
            .filter(namespace => namespace.alias)
            .filter(({endHeight, levels}) => (levels < networkConfig.maxNamespaceDepth
                && endHeight - currentHeight + namespaceGracePeriodDuration > 0))
            .map(alias => ({label: alias.name, value: alias.name}))
    }

    get activeNamespaceList(): { label: string, value: string }[] {
        const {activeMultisigAddress} = this
        // @TODO handle namespace list loading state
        return activeMultisigAddress ? this.multisigNamespaceList : this.namespaceList
    }

    get defaultFees(): DefaultFee[] {
        if (!this.activeMultisigAccount) return DEFAULT_FEES[FEE_GROUPS.SINGLE]
        if (!this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.DOUBLE]
        if (this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.TRIPLE]
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed}) => feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get feeDivider(): number {
        if (!this.activeMultisigAccount) return 1
        if (!this.announceInLock) return 2
        if (this.announceInLock) return 3
    }

    showErrorMessage(message): void {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    createByMultisig(): void {
        let {feeAmount, feeDivider} = this
        let {multisigPublicKey} = this.formItems
        const {networkType} = this.wallet
        const rootNamespaceTransaction = this.createSubNamespace()

        if (this.announceInLock) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [rootNamespaceTransaction],
                multisigPublicKey,
                networkType,
                feeAmount / feeDivider
            )

            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [rootNamespaceTransaction],
            multisigPublicKey,
            networkType,
            feeAmount / feeDivider
        )
        this.transactionList = [aggregateTransaction]
    }

    createSubNamespace() {
        let {rootNamespaceName, subNamespaceName} = this.formItems
        const {feeAmount, feeDivider} = this
        const {networkType} = this.wallet

        return NamespaceRegistrationTransaction.createSubNamespace(
            Deadline.create(),
            subNamespaceName,
            rootNamespaceName,
            networkType,
            UInt64.fromUint(feeAmount / feeDivider)
        )
    }  

    createBySelf() {
        let transaction = this.createSubNamespace()
        this.transactionList = [transaction]
    }

    async confirmViaTransactionConfirmation() {
        if (this.hasMultisigAccounts) {
            this.createByMultisig()
        } else {
            this.createBySelf()
        }

        try {
            const {
                success,
                signedTransaction,
                signedLock,
            } = await signTransaction({
                transaction: this.transactionList[0],
                store: this.$store,
            })

            if(success) {
                new AppWallet(this.wallet).announceTransaction(signedTransaction, this.activeAccount.node, this, signedLock)
            }
        } catch (error) {
            console.error("SubNamespaceTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }

    async submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.confirmViaTransactionConfirmation()
            })
    }

    get lockParams(): LockParams {
        const {announceInLock, feeAmount, feeDivider} = this
        return new LockParams(announceInLock, feeAmount / feeDivider)
    }

    resetFields() {
        this.$nextTick(() => this.$validator.reset())
    }


    @Watch('formItems.multisigPublicKey')
    onMultisigPublicKeyChange(newPublicKey, oldPublicKey) {
        if (!newPublicKey || newPublicKey === oldPublicKey) return
        this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', newPublicKey)
    }

    mounted() {
        this.resetFields()
        this.formItems.multisigPublicKey = this.accountPublicKey
    }
}
