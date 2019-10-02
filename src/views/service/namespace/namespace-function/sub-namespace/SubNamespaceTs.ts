import {mapState} from "vuex"
import {Address, PublicAccount, MultisigAccountInfo, NetworkType} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {Message, networkConfig, formDataConfig, defaultNetworkConfig, DEFAULT_FEES, FEE_GROUPS} from "@/config"
import {NamespaceApiRxjs} from "@/core/api/NamespaceApiRxjs.ts"
import {getAbsoluteMosaicAmount, formatAddress} from '@/core/utils'
import {createBondedMultisigTransaction, createCompleteMultisigTransaction, AppNamespace, StoreAccount, AppInfo, AppWallet, DefaultFee} from "@/core/model"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

@Component({
    components: {
        CheckPWDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class SubNamespaceTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    durationIntoDate = 0
    isCompleteForm = true
    showCheckPWDialog = false
    otherDetails: any = {}
    transactionDetail = {}
    transactionList = []
    currentMinApproval = -1
    formItems = formDataConfig.subNamespaceForm
    namespaceGracePeriodDuration = networkConfig.namespaceGracePeriodDuration
    formatAddress = formatAddress
    XEM: string = defaultNetworkConfig.XEM

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
        return this.activeAccount.multisigAccountInfo[address].minApproval > 1
    }

    get multisigInfo(): MultisigAccountInfo {
        const {address} = this.wallet
        return this.activeAccount.multisigAccountInfo[address]
    }

    get hasMultisigAccounts(): boolean {
        if (!this.multisigInfo) return false
        return this.multisigInfo.multisigAccounts.length > 0
    }

    get multisigPublicKeyList(): {publicKey: string, address: string}[] {
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

    get xemDivisibility(): number {
        return this.activeAccount.xemDivisibility
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

    get namespaceList(): {label: string, value: string}[] {
        const {currentHeight, namespaceGracePeriodDuration} = this
        const {namespaces} = this.activeAccount
        if (!namespaces) return []

        // @TODO: refactor and make it an AppNamespace method
        return namespaces
            .filter(({alias, endHeight, levels}) => (endHeight - currentHeight > namespaceGracePeriodDuration && levels < 3))
            .map(alias => ({label: alias.label, value: alias.label}))
    }

    get multisigNamespaceList(): {label: string, value: string}[] {
        const {currentHeight, namespaceGracePeriodDuration, activeMultisigAddress} = this
        if (!activeMultisigAddress) return []
        const namespaces: AppNamespace[] = this.activeAccount.multisigAccountsNamespaces[activeMultisigAddress]
        if (!namespaces) return []

        // @TODO: refactor and make it an AppNamespace method
        return namespaces
            .filter(({alias, endHeight, levels}) => (endHeight - currentHeight > namespaceGracePeriodDuration && levels < 3))
            .map(alias => ({label: alias.label, value: alias.label}))
    }

    get activeNamespaceList(): {label: string, value: string}[] {
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
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.xemDivisibility)
    }

    get feeDivider(): number {
        if (!this.activeMultisigAccount) return 1
        if (!this.announceInLock) return 2
        if (this.announceInLock) return 3
    }

    async checkEnd(isPasswordRight): Promise<void> {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    showErrorMessage(message): void {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    createByMultisig(): void{
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

    checkForm(): boolean {
        const {rootNamespaceName, subNamespaceName} = this.formItems

        if (!rootNamespaceName || !rootNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }
        if (!subNamespaceName || !subNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }
        if (subNamespaceName.length > 64) {
            this.showErrorMessage(this.$t(Message.SUB_NAMESPACE_LENGTH_LONGER_THAN_64_ERROR))
            return false
        }
        if (!subNamespaceName.match(/^[a-z].*/)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
            return false
        }
        if (!subNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
            return false
        }

        const subFlag = networkConfig.reservedRootNamespaceNames.every((item) => {
            if (item == subNamespaceName) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_USE_BANNED_WORD_ERROR))
                return false
            }
            return true
        })
        return subFlag
    }

    createSubNamespace() {
        let {rootNamespaceName, subNamespaceName} = this.formItems
        const {feeAmount, feeDivider} = this
        const {networkType} = this.wallet
        return new NamespaceApiRxjs().createdSubNamespace(
            subNamespaceName,
            rootNamespaceName,
            networkType,
            feeAmount / feeDivider
        )
    }

    initForm() {
        this.formItems = formDataConfig.subNamespaceForm
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }
    
    submit() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {rootNamespaceName, subNamespaceName} = this.formItems
        const {feeAmount, feeDivider} = this
        this.transactionDetail = {
            "namespace": rootNamespaceName,
            "innerFee": feeAmount/feeDivider,
            "sub_namespace": subNamespaceName,
            "fee": feeAmount/feeDivider
        }

        if (this.announceInLock) {
            this.otherDetails = {
                lockFee: feeAmount / 3
            }
        }

        if (!this.hasMultisigAccounts) {
            this.createBySelf()
        } else {
            this.createByMultisig()
        }
        this.showCheckPWDialog = true
    }

    createBySelf() {
        let transaction = this.createSubNamespace()
        this.transactionList = [transaction]
    }

    @Watch('formItems.multisigPublicKey')
    onMultisigPublicKeyChange(newPublicKey, oldPublicKey) {
        if (!newPublicKey || newPublicKey === oldPublicKey) return
        this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', newPublicKey)
    }

    @Watch('formItems', {deep: true})
    onFormItemChange() {
        const {rootNamespaceName, subNamespaceName, multisigPublicKey} = this.formItems

        // isCompleteForm
        if (!this.hasMultisigAccounts) {
            this.isCompleteForm = rootNamespaceName !== '' && subNamespaceName !== ''
            return
        }
        this.isCompleteForm = rootNamespaceName !== '' && subNamespaceName !== '' && multisigPublicKey && multisigPublicKey.length === 64
        this.isCompleteForm = true
    }

    mounted() {
        this.formItems.multisigPublicKey = this.accountPublicKey
    }
}
