import {TransactionType, NamespaceId} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {formatNumber, renderMosaics} from '@/core/utils'
import {FormattedTransaction, AppInfo, StoreAccount, TRANSACTIONS_CATEGORIES, AppWallet} from '@/core/model'
import {defaultNetworkConfig, explorerUrlHead} from '@/config'
import {signTransaction} from '@/core/services'
import TransactionModal from '@/components/transaction-modal/TransactionModal.vue'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {TransactionModal},
})
export class TransactionListTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    pageSize: number = 10
    highestPrice = 0
    isLoadingModalDetailsInfo = false
    page: number = 1
    formatNumber = formatNumber
    renderMosaics = renderMosaics
    TransactionType = TransactionType
    scroll: any
    showDialog: boolean = false
    activeTransaction: FormattedTransaction = null
    NamespaceId = NamespaceId

    @Prop({default: null})
    mode: string

    get wallet() {
        return this.activeAccount.wallet
    }

    get transactionsLoading() {
        return (this.mode && this.mode === TRANSACTIONS_CATEGORIES.TO_COSIGN) ? false : this.app.transactionsLoading
    }

    get transactionList() {
        if (this.mode && this.mode === TRANSACTIONS_CATEGORIES.TO_COSIGN) {
            const {wallet, transactionsToCosign} = this.activeAccount
            const {publicKey} = wallet
            return transactionsToCosign[publicKey] || []
        }

        return this.activeAccount.transactionList
    }

    get mosaicList() {
        return this.activeAccount.mosaics
    }

    get slicedTransactionList() {
        const start = (this.page - 1) * this.pageSize
        const end = this.page * this.pageSize
        return [...this.transactionList].slice(start, end)
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get namespaces() {
        return this.activeAccount.namespaces
    }


    getExplorerUrl(transactionHash) {
        return explorerUrlHead + transactionHash

    }


    get pageTitle() {
        return this.mode === TRANSACTIONS_CATEGORIES.TO_COSIGN
            ? 'Transactions_to_cosign'
            : 'transaction_record'
    }

    getName(namespaceId: NamespaceId) {
        const hexId = namespaceId.toHex()
        const namespace = this.namespaces.find(({hex}) => hexId === hex)
        if (namespace === undefined) return hexId
        return namespace.name
    }

    renderHeightAndConfirmation(transactionHeight: number): string {
        if (transactionHeight === 0) return null
        const {currentHeight} = this
        if (!currentHeight) return `${transactionHeight}`

        const confirmations = currentHeight - transactionHeight + 1
        /** Prevents a reactivity glitch */
        if (confirmations < 0) return `${transactionHeight}`

        const {networkConfirmations} = defaultNetworkConfig
        if (confirmations > networkConfirmations) return `${transactionHeight}`
        return `(${confirmations}/${networkConfirmations}) - ${transactionHeight.toLocaleString()}`
    }

    // @TODO: move out from there
    miniHash(hash: string): string {
        return `${hash.substring(0, 18).toLowerCase()}***${hash.substring(42).toLowerCase()}`
    }

    // @TODO: Changing tab should reset the newly selected tab's pagination to 1
    async changePage(page) {
        this.page = page
        this.scrollTop()
    }

    divScroll(div) {
        this.scroll = div
    }

    scrollTop() {
        this.scroll.target.scrollTop = 0
    }

    async confirmViaTransactionConfirmation() {
        try {
            const {
                success,
                signedTransaction,
                signedLock,
            } = await signTransaction({
                transaction: this.activeTransaction.rawTx,
                store: this.$store,
            })

            if (success) {
                new AppWallet(this.wallet).announceTransaction(signedTransaction, this.activeAccount.node, this, signedLock)
            }
        } catch (error) {
            console.error("TransactionListTs -> confirmViaTransactionConfirmation -> error", error)
        }
    }

    transactionClicked(transaction: FormattedTransaction) {
        this.activeTransaction = transaction

        if (this.mode === TRANSACTIONS_CATEGORIES.TO_COSIGN) {
            return this.confirmViaTransactionConfirmation()
        }

        this.showDialog = true
    }
}
