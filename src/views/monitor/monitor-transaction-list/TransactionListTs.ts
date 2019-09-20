import {TransactionType} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {formatNumber, renderMosaics} from '@/core/utils'
import {FormattedTransaction} from '@/core/model';
import TransactionModal from '@/views/monitor/monitor-transaction-modal/TransactionModal.vue'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: { TransactionModal },
})
export class TransactionListTs extends Vue {
    app: any
    activeAccount: any
    pageSize: number = 10
    highestPrice = 0
    isLoadingModalDetailsInfo = false
    page: number = 1
    formatNumber = formatNumber
    renderMosaics = renderMosaics
    TransactionType = TransactionType

    showDialog: boolean = false
    activeTransaction: FormattedTransaction = null

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

    // @TODO: move out from there
    renderHeightAndConfirmation(height) {
        const {currentHeight} = this
        if (!currentHeight) return height
        const confirmations = currentHeight - height
        if (confirmations > 500) return height.toLocaleString() //@TODO 500 shouldn't be hardcoded
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
