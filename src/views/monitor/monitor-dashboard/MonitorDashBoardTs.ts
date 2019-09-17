import {mapState} from "vuex"
import {market} from "@/core/api/logicApi.ts"
import {KlineQuery} from "@/core/query/klineQuery.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import LineChart from '@/common/vue/line-chart/LineChart.vue'
import numberGrow from '@/common/vue/number-grow/NumberGrow.vue'
import {
    isRefreshData, localSave, localRead, formatNumber,
    renderMosaics, renderMosaicNames, renderMosaicAmount
} from '@/core/utils'
import { TransactionType} from 'nem2-sdk'
import {networkStatusList} from "@/config/view";

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        LineChart,
        numberGrow
    }
})
export class MonitorDashBoardTs extends Vue {
    app: any
    activeAccount: any
    pageSize: number = 10
    highestPrice = 0
    riseRange: any = 0
    lowestPrice: any = 0
    averagePrice: any = 0
    updateAnimation = ''
    isShowDialog = false
    isShowInnerDialog = false
    currentInnerTransaction = {}
    receiptList = []
    isShowTransferTransactions = true
    transactionDetails: any = {}
    isLoadingModalDetailsInfo = false
    networkStatusList = networkStatusList
    page: number = 1
    formatNumber = formatNumber
    renderMosaics = renderMosaics
    renderMosaicNames = renderMosaicNames
    renderMosaicAmount = renderMosaicAmount

    get wallet() {
        return this.activeAccount.wallet
    }

    get xemUsdPrice() {
        return this.app.xemUsdPrice
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

    get transferTransactionList() {
        const {transactionList} = this
        return [...transactionList].filter(({rawTx})=>rawTx.type === TransactionType.TRANSFER)
    }

    get receiptTransactionList() {
        const {transactionList} = this
        return [...transactionList].filter(({rawTx})=>rawTx.type !== TransactionType.TRANSFER)
    }

    get slicedReceiptsLists() {
        const start = (this.page - 1) * this.pageSize
        const end = this.page * this.pageSize
        return [...this.receiptTransactionList].slice(start, end)
    }

    get slicedTransferList() {
        const start = (this.page - 1) * this.pageSize
        const end = this.page * this.pageSize
        return [...this.transferTransactionList].slice(start, end)
    }

    get selectedListLength() {
        return this.isShowTransferTransactions
            ? this.transferTransactionList.length
            : this.receiptTransactionList.length
    }

    get chainStatus() {
        return this.app.chainStatus
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

    // @COSMETIC: page names as constants would be better than true false
    switchTransactionPanel(flag) {
        this.isShowTransferTransactions = flag
    }

    // @TODO: Changing tab should reset the newly selected tab's pagination to 1
    // @TODO: Scroll to top of the list when changing page
    async changePage(page) {
        this.page = page
    }

    // @TODO: review
    async getMarketPrice() {
        if (!isRefreshData('oneWeekPrice', 1000 * 60 * 60 * 24, new Date().getHours())) {
            const oneWeekPrice = JSON.parse(localRead('oneWeekPrice'))
            this.highestPrice = oneWeekPrice.highestPrice
            this.lowestPrice = oneWeekPrice.lowestPrice
            this.averagePrice = oneWeekPrice.averagePrice
            this.riseRange = oneWeekPrice.riseRange
            return
        }
        const that = this
        const rstStr = await market.kline({period: "1day", symbol: "xemusdt", size: "14"})
        if (!rstStr.rst) {
            return
        }
        const rstQuery: KlineQuery = JSON.parse(rstStr.rst)
        const result = rstQuery.data
        const currentWeek = result.slice(0, 7)
        const preWeek = result.slice(7, 14)

        currentWeek.sort((a, b) => {
            return a.high < b.high ? 1 : -1
        })
        that.highestPrice = currentWeek[0].high

        currentWeek.sort((a, b) => {
            return a.low < b.low ? -1 : 1
        })
        that.lowestPrice = currentWeek[0].low

        let average = 0
        currentWeek.forEach((item) => {
            average += (item.high + item.low) / 2
        })
        that.averagePrice = (average / 7).toFixed(4)

        let preAverage: any = 0
        preWeek.forEach((item) => {
            preAverage += (item.high + item.low) / 2
        })
        preAverage = (preAverage / 7).toFixed(4)
        that.riseRange = (((that.averagePrice - preAverage) / preAverage) * 100).toFixed(2)
        const oneWeekPrice = {
            averagePrice: that.averagePrice,
            riseRange: that.riseRange,
            lowestPrice: that.lowestPrice,
            highestPrice: that.highestPrice,
            timestamp: new Date().getTime()
        }
        localSave('oneWeekPrice', JSON.stringify(oneWeekPrice))
    }

    // @TODO: isn't it doable in pure CSS?
    @Watch('currentHeight')
    onChainStatus() {
        this.updateAnimation = 'appear'
        setTimeout(() => {
            this.updateAnimation = 'appear'
        }, 500)
    }

    mounted() {
        this.getMarketPrice() // @TODO: review
    }
}
