import {TransactionType, NamespaceId} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {formatNumber, renderMosaics} from '@/core/utils'
import {FormattedTransaction, AppInfo, StoreAccount} from '@/core/model'
import TransactionModal from '@/components/transaction-modal/TransactionModal.vue'
import {defaultNetworkConfig} from '@/config'

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

    get wallet() {
        return this.activeAccount.wallet
    }

    get transactionsLoading() {
        return this.app.transactionsLoading
    }

    get transactionList() {
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
    
    getName(namespaceId: NamespaceId) {
        const hexId = namespaceId.toHex()
        const namespace = this.namespaces.find(({hex}) => hexId === hex)
        if (namespace === undefined) return hexId
        return namespace.name
    }

    renderHeightAndConfirmation(transactionHeight: number): string {
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
}
