import {Component, Vue} from 'vue-property-decorator'
import {Address} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount, AppWallet, FormattedTransaction, AppInfo} from "@/core/model"
import {networkConfig} from "@/config"
import DelegatedDialog from '@/components/forms/delegated-dialog/DelegatedDialog.vue'
import TransactionModal from '@/components/transaction-modal/TransactionModal.vue'
import {tinyHash} from '@/core/utils'

const {EMPTY_PUBLIC_KEY} = networkConfig

const stepMap = {
    AccountLink: 1,
    NodeConfig: 2,
    NodeLink: 3
}

@Component({
    components: {DelegatedDialog,  TransactionModal},
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class WalletHarvestingTs extends Vue {
    activeAccount: StoreAccount
    showTransactionModal: boolean = false
    activeDelegationTransaction: FormattedTransaction = null
    viewAccountPropertiesOnly = false
    showDelegatedDialog = false
    currentDelegatedStep = 0
    miniHash = tinyHash
    stepMap = stepMap
    app: AppInfo
    showDelegatedData = false
    delegatedDataList = []

  get wallet() {
        return new AppWallet(this.activeAccount.wallet)
    }

    get persistentAccountRequestTransactions(): FormattedTransaction[] {
        return this.wallet.getPersistentAccountRequests(this.$store)
    }

    get linkedAccountKey() {
        return this.wallet.linkedAccountKey
    }

    get linkedAddress() {
        return this.wallet.linkedAccountKey ? Address.createFromPublicKey(this.linkedAccountKey, this.wallet.networkType).pretty() : null
    }

    get isLinked(): boolean {
        return this.linkedAccountKey && this.linkedAccountKey !== EMPTY_PUBLIC_KEY
    }

    get remoteNodeConfig() {
        return this.activeAccount.wallet.temporaryRemoteNodeConfig
    }

    get passwordInTemporary() {
        if (!this.activeAccount.temporaryLoginInfo) return null
        const {password} = this.activeAccount.temporaryLoginInfo
        return password
    }

    get temporaryRemoteNodeConfig() {
        return this.activeAccount.wallet.temporaryRemoteNodeConfig
    }

    showTransactionDetail(transaction: FormattedTransaction) {
        this.activeDelegationTransaction = transaction
        this.showTransactionModal = true
    }

    setCurrentDelegatedStep(index) {
        this.currentDelegatedStep = index
    }

    switchDelegatedStep(index) {
        this.showDelegatedDialog = true
        this.currentDelegatedStep = index
        if (this.currentDelegatedStep == stepMap.NodeLink && !this.temporaryRemoteNodeConfig) {
            this.currentDelegatedStep = stepMap.NodeConfig
        }
        if (this.currentDelegatedStep == stepMap.NodeConfig && !this.linkedAccountKey) {
            this.currentDelegatedStep = stepMap.AccountLink
        }
    }
}
