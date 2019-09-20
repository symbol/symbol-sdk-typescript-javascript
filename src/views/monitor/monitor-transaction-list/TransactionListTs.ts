import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {formatNumber, renderMosaics} from '@/core/utils'
import {TransactionType} from 'nem2-sdk'
import {networkStatusConfig} from '@/config/view/setting'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class TransactionListTs extends Vue {
    app: any
    activeAccount: any
    pageSize: number = 10
    highestPrice = 0
    isShowDialog = false
    isShowInnerDialog = false
    currentInnerTransaction = {}
    receiptList = []
    isShowTransferTransactions = true
    transactionDetails: any = {}
    isLoadingModalDetailsInfo = false
    networkStatusList = networkStatusConfig
    page: number = 1
    formatNumber = formatNumber
    renderMosaics = renderMosaics
    TransactionType = TransactionType

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

    get currentXem() {
        return this.activeAccount.currentXem
    }

    showDialog(transaction) {
        this.isShowDialog = true
        this.transactionDetails = transaction
    }

    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }

    // @TODO: move out from there
    renderHeightAndConfirmation(height) {
        const {currentHeight} = this
        if (!currentHeight) return height
        const confirmations = currentHeight - height
        if (confirmations > 500) return height //@TODO 500 shouldn't be hardcoded
        return `${confirmations} / ${height.toLocaleString()}`
    }

    // @TODO: move out from there
    miniHash(hash: string): string {
        return `${hash.substring(0, 8).toLowerCase()}...${hash.substring(54).toLowerCase()}`;
    }

    // @TODO: Changing tab should reset the newly selected tab's pagination to 1
    // @TODO: Scroll to top of the list when changing page
    async changePage(page) {
        this.page = page
    }
}
