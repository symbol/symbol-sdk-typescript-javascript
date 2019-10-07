import {mapState} from "vuex"
import {
    PublicAccount, MultisigAccountInfo, NetworkType, Address,
    NamespaceRegistrationTransaction, UInt64, Deadline,
} from "nem2-sdk"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {Message, networkConfig, DEFAULT_FEES, FEE_GROUPS, formDataConfig} from "@/config"
import CheckPWDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {
    getAbsoluteMosaicAmount, formatSeconds, formatAddress,
} from '@/core/utils'
import {StoreAccount, AppInfo, DefaultFee, AppWallet} from "@/core/model"
import {createBondedMultisigTransaction, createCompleteMultisigTransaction} from '@/core/services'

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
export class RootNamespaceTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    transactionDetail = {}
    isCompleteForm = false
    currentMinApproval = -1
    durationIntoDate: any = 0
    showCheckPWDialog = false
    transactionList = []
    otherDetails: any = {}
    formItems = formDataConfig.rootNamespaceForm
    formatAddress = formatAddress

    get wallet(): AppWallet {
        return this.activeAccount.wallet
    }

    get activeMultisigAccount(): string {
        return this.activeAccount.activeMultisigAccount
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

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    get generationHash(): string {
        return this.activeAccount.generationHash
    }

    get node(): string {
        return this.activeAccount.node
    }

    initForm(): void {
        this.formItems = formDataConfig.rootNamespaceForm
    }

    get multisigAccountInfo(): MultisigAccountInfo {
        return this.activeAccount.multisigAccountInfo[this.wallet.address]
    }

    get accountPublicKey(): string {
        return this.activeAccount.wallet.publicKey
    }

    get multisigAccounts(): PublicAccount[] {
        return this.multisigAccountInfo ? this.multisigAccountInfo.multisigAccounts : []
    }

    get defaultFees(): DefaultFee[] {
        if (!this.activeMultisigAccount) return DEFAULT_FEES[FEE_GROUPS.SINGLE]
        if (!this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.DOUBLE]
        if (this.announceInLock) return DEFAULT_FEES[FEE_GROUPS.TRIPLE]
    }

    get feeAmount(): number {
        const {feeSpeed} = this.formItems
        const feeAmount = this.defaultFees.find(({speed})=>feeSpeed === speed).value
        return getAbsoluteMosaicAmount(feeAmount, this.networkCurrency.divisibility)
    }

    get feeDivider(): number {
        if (!this.activeMultisigAccount) return 1
        if (!this.announceInLock) return 2
        if (this.announceInLock) return 3
    }

    createRootNamespace(): NamespaceRegistrationTransaction {
        const {networkType} =  this.wallet
        const {rootNamespaceName, duration} = this.formItems
        const {feeAmount, feeDivider} = this

        return NamespaceRegistrationTransaction
            .createRootNamespace(
                Deadline.create(),
                rootNamespaceName,
                UInt64.fromUint(duration),
                networkType,
                UInt64.fromUint(feeAmount/feeDivider),
            )
    }

    async createBySelf() {
        this.transactionList = [this.createRootNamespace()]
    }

    createByMultisig() {
        const {feeAmount} = this
        const {multisigPublicKey} = this.formItems
        const {networkType} = this.wallet
        const fee = feeAmount/3

        const rootNamespaceTransaction = this.createRootNamespace()

        if (this.announceInLock) {
            const aggregateTransaction = createBondedMultisigTransaction(
                [rootNamespaceTransaction],
                multisigPublicKey,
                networkType,
                fee,
            )

            this.transactionList = [aggregateTransaction]
            return
        }
        const aggregateTransaction = createCompleteMultisigTransaction(
            [rootNamespaceTransaction],
            multisigPublicKey,
            networkType,
            fee,
        )
        this.transactionList = [aggregateTransaction]
    }

    async checkEnd(isPasswordRight) {
        if (!isPasswordRight) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkForm(): boolean {
        const {duration, rootNamespaceName, multisigPublicKey} = this.formItems

        // check multisig
        if (this.hasMultisigAccounts) {
            if (!multisigPublicKey) {
                this.$Notice.error({
                    title: this.$t(Message.INPUT_EMPTY_ERROR) + ''
                })
                return false
            }
        }

        if (!Number(duration) || Number(duration) < 0) {
            this.showErrorMessage(this.$t(Message.DURATION_VALUE_LESS_THAN_1_ERROR))
            return false
        }

        if (!rootNamespaceName || !rootNamespaceName.trim()) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_NULL_ERROR))
            return false
        }

        if (rootNamespaceName.length > 16) {
            this.showErrorMessage(this.$t(Message.ROOT_NAMESPACE_TOO_LONG_ERROR))
            return false
        }

        if (!rootNamespaceName.match(/^[a-z].*/)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_STARTING_ERROR))
            return false
        }
        if (!rootNamespaceName.match(/^[0-9a-zA-Z_-]*$/g)) {
            this.showErrorMessage(this.$t(Message.NAMESPACE_FORMAT_ERROR))
            return false
        }

        const flag = networkConfig.reservedRootNamespaceNames.every((item) => {
            if (item == rootNamespaceName) {
                this.showErrorMessage(this.$t(Message.NAMESPACE_USE_BANNED_WORD_ERROR))
                return false
            }
            return true
        })
        return flag
    }

    showErrorMessage(message) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: message
        })
    }

    createTransaction() {
        if (!this.isCompleteForm) return
        if (!this.checkForm()) return
        const {feeAmount} = this
        const {address} = this.wallet
        const {duration, rootNamespaceName} = this.formItems
        this.transactionDetail = {
            "address": address,
            "duration": duration,
            "namespace": rootNamespaceName,
            "fee": feeAmount / Math.pow(10, this.networkCurrency.divisibility),
        }

        if (this.announceInLock) {
            this.otherDetails = {
                lockFee: feeAmount / 3
            }
        }

        if (this.activeMultisigAccount) {
            this.createByMultisig()
            this.showCheckPWDialog = true
            return
        }

        this.createBySelf()
        this.showCheckPWDialog = true
    }

    // @TODO: target blockTime is hardcoded
    changeXEMRentFee() {
        const duration = Number(this.formItems.duration)
        if (Number.isNaN(duration)) {
            this.formItems.duration = 0
            this.durationIntoDate = 0
            return
        }
        if (duration * 12 >= 60 * 60 * 24 * 365) {
            this.showErrorMessage(this.$t(Message.DURATION_MORE_THAN_1_YEARS_ERROR) + '')
            this.formItems.duration = 0
        }
        this.durationIntoDate = formatSeconds(duration * 12)
    }

    @Watch('formItems.multisigPublicKey')
    onMultisigPublicKeyChange(newPublicKey, oldPublicKey) {
        if (!newPublicKey || newPublicKey === oldPublicKey) return
        this.$store.commit('SET_ACTIVE_MULTISIG_ACCOUNT', newPublicKey)
    }

    @Watch('formItems', {immediate: true, deep: true})
    onFormItemChange() {
        const {duration, rootNamespaceName, multisigPublicKey} = this.formItems
        if (!this.activeMultisigAccount) {
            this.isCompleteForm = duration + '' !== '' && rootNamespaceName !== ''
            return
        }
        this.isCompleteForm = duration + '' !== '' && rootNamespaceName !== '' && multisigPublicKey && multisigPublicKey.length === 64
    }

    mounted() {
        this.formItems.multisigPublicKey = this.accountPublicKey
    }
}
