import {mapState} from "vuex"
import {market} from "@/core/api/logicApi.ts"
import {PublicAccount, NetworkType} from 'nem2-sdk'
import {KlineQuery} from "@/core/query/klineQuery.ts"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import {MosaicApiRxjs} from '@/core/api/MosaicApiRxjs.ts'
import {transactionFormat} from '@/core/utils/format.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import LineChart from '@/common/vue/line-chart/LineChart.vue'
import numberGrow from '@/common/vue/number-grow/NumberGrow.vue'
import {getBlockInfoByTransactionList, getMosaicInfoList} from "@/core/utils/wallet"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {isRefreshData, localSave, localRead} from '@/core/utils/utils.ts'
import {networkStatusList, xemTotalSupply} from '@/config/index.ts'
import {formatNumber} from "@/core/utils/utils"

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        LineChart,
        numberGrow
    }
})
export class MonitorDashBoardTs extends Vue {
    app: any
    highestPrice = 0
    riseRange: any = 0
    lowestPrice: any = 0
    purchaseAmount: any = 10
    averagePrice: any = 0
    currentPrice: any = 0
    activeAccount: any
    updateAnimation = ''
    isShowDialog = false
    isShowInnerDialog = false
    currentInnerTransaction = {}
    currentDataAmount = 0
    transferListLength = 0
    receiptListLength = 0
    currentTransactionList = []
    xemNum: number = xemTotalSupply
    allTransactionsList = []
    transferTransactionList = []
    isLoadingTransactions = false
    receiptList = []
    isShowTransferTransactions = true
    transactionDetails: any = {}
    isLoadingModalDetailsInfo = false
    networkStatusList = networkStatusList


    get wallet() {
        return this.activeAccount.wallet
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get node() {
        return this.activeAccount.node
    }

    get chainStatus() {
        return this.app.chainStatus
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get timeZone() {
        return this.app.timeZone
    }

    // getRelativeMosaicAmount
    showDialog(transaction, isTransferTransaction?: boolean) {
        let MosaicDivisibilityMap = {}
        const that = this
        const {node} = this
        this.isLoadingModalDetailsInfo = true
        this.isShowDialog = true
        const transactionMosaicList = transaction.mosaics
        that.transactionDetails = transaction
        if (isTransferTransaction) {
            const mosaicIdList = transactionMosaicList.map((item) => {
                return item.id
            })
            new MosaicApiRxjs().getMosaics(node, mosaicIdList).subscribe((mosaicInfoList: any) => {
                //  todo format alias and mosaic
                mosaicInfoList.forEach(mosaicInfo => {
                    MosaicDivisibilityMap[mosaicInfo.mosaicId.toHex()] = {
                        divisibility: mosaicInfo.properties.divisibility
                    }
                })
                transaction.dialogDetailMap.mosaic = transactionMosaicList.map((item) => {
                    const mosaicHex = item.id.id.toHex() + ''
                    return '' + mosaicHex + `(${that.getRelativeMosaicAmount(item.amount.compact(), MosaicDivisibilityMap[mosaicHex].divisibility)})`
                }).join(',')
                that.transactionDetails = transaction
                that.isLoadingModalDetailsInfo = false
            })
        } else {
            this.isLoadingModalDetailsInfo = false
        }
    }

    getRelativeMosaicAmount(amount, divisibility) {
        if (!amount) return 0
        return amount / Math.pow(10, divisibility)
    }

    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }

    async getMarketOpenPrice() {
        if (!isRefreshData('openPriceOneMinute', 1000 * 60, new Date().getSeconds())) {
            const openPriceOneMinute = JSON.parse(localRead('openPriceOneMinute'))
            this.currentPrice = openPriceOneMinute.openPrice * this.xemNum
            return
        }
        const that = this
        const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"})
        if (!rstStr.rst) return
        const rstQuery: KlineQuery = JSON.parse(rstStr.rst)
        const result = rstQuery.data ? rstQuery.data[0].close : 0
        that.currentPrice = result * that.xemNum
        const openPriceOneMinute = {
            timestamp: new Date().getTime(),
            openPrice: result
        }
        localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))
    }

    switchTransactionPanel(flag) {
        this.isShowTransferTransactions = flag
        this.currentDataAmount = flag ? this.transferListLength : this.receiptListLength
        this.changePage(1)
    }

    getPointInfo() {
        const that = this
        const {node} = this
        new BlockApiRxjs().getBlockchainHeight(node).subscribe((res) => {
            const height = Number.parseInt(res.toHex(), 16)
            that.$store.commit('SET_CHAIN_STATUS', {currentHeight: height})
            new BlockApiRxjs().getBlockByHeight(node, height).subscribe((block) => {
                const chainStatus = {
                    numTransactions: block.numTransactions ? block.numTransactions : 0,
                    signerPublicKey: block.signer.publicKey,
                    currentHeight: block.height.compact(),
                    currentBlockInfo: block,
                    currentGenerateTime: 12
                }
                that.$store.commit('SET_CHAIN_STATUS', chainStatus)
            })
        })
    }


    refreshTransferTransactionList() {
        const that = this
        let {accountPublicKey, node} = this
        if (!accountPublicKey || accountPublicKey.length < 64) return
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
        new TransactionApiRxjs().transactions(
            publicAccount,
            {
                pageSize: 100
            },
            node,
        ).subscribe(async (transactionsInfo) => {
            that.allTransactionsList.push(...transactionsInfo)
            try {
                await that.getBlockInfoByTransactionList(that.allTransactionsList, node)
            } catch (e) {
                console.log(e)
            }
        })
    }

    refreshReceiptList() {
        this.isLoadingTransactions = true
        const that = this
        let {accountPublicKey, node} = this
        if (!accountPublicKey || accountPublicKey.length < 64) return
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
        new TransactionApiRxjs().unconfirmedTransactions(
            publicAccount,
            {
                pageSize: 100
            },
            node,
        ).subscribe(async (unconfirmedtransactionsInfo: any) => {
            unconfirmedtransactionsInfo = unconfirmedtransactionsInfo.map((unconfirmedtransaction) => {
                unconfirmedtransaction.isTxUnconfirmed = true
                return unconfirmedtransaction
            })
            that.allTransactionsList.push(...unconfirmedtransactionsInfo)
            try {
                await that.getBlockInfoByTransactionList(that.allTransactionsList, node)
            } catch (e) {
                console.log(e)
            }
        })
    }


    async changePage(page) {
        const pageSize = 10
        const {isShowTransferTransactions, node} = this
        const start = (page - 1) * pageSize
        const that = this
        const end = page * pageSize
        if (isShowTransferTransactions) {
            let transactionList = this.transferTransactionList.slice(start, end)
            let resultList = transactionList
            that.currentTransactionList = transactionList
            if (transactionList.length > 0) {
                that.isLoadingTransactions = true
                Promise.all(transactionList.map(async (item, index) => {
                    if (item.mosaics.length == 1) {
                        //infoThird
                        const amount = item.mosaics[0].amount.compact()
                        const mosaicInfoList = await getMosaicInfoList(node, [item.mosaics[0].id])
                        const mosaicInfo: any = mosaicInfoList[0]
                        resultList[index].infoThird = (item.isReceipt ? '+' : '-') + that.getRelativeMosaicAmount(amount, mosaicInfo.properties.divisibility)
                    }
                })).then(() => {
                    that.currentTransactionList = [...resultList]
                    that.isLoadingTransactions = false
                })

                return
            } else {
                that.currentTransactionList = []
                this.isLoadingTransactions = false
                return
            }
        }
        this.isLoadingTransactions = false
        this.currentTransactionList = this.receiptList.slice(start, end)
    }

    getBlockInfoByTransactionList(transactionList, node) {
        const {timeZone} = this
        getBlockInfoByTransactionList(transactionList, node, timeZone)
    }

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


    @Watch('wallet.address')
    onGetWalletChange() {
        this.allTransactionsList = []
        this.refreshReceiptList()
        this.refreshTransferTransactionList()
        this.getMarketOpenPrice()
        this.getPointInfo()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.allTransactionsList = []
        this.refreshReceiptList()
        this.refreshTransferTransactionList()
    }

    @Watch('allTransactionsList')
    onAllTransacrionListChange() {
        const {currentXEM1, node, currentXem} = this
        const {allTransactionsList, accountAddress, isShowTransferTransactions, xemDivisibility} = this
        const transactionList = transactionFormat(allTransactionsList, accountAddress, currentXEM1, xemDivisibility, node, currentXem)
        this.transferTransactionList = transactionList.transferTransactionList
        this.receiptList = transactionList.receiptList
        this.changePage(1)
        this.transferListLength = this.transferTransactionList.length
        this.receiptListLength = this.receiptList.length
        this.currentDataAmount = isShowTransferTransactions ? this.transferListLength : this.receiptListLength

    }


    @Watch('currentHeight')
    onChainStatus() {
        this.updateAnimation = 'appear'
        setTimeout(() => {
            this.updateAnimation = 'appear'
        }, 500)
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    mounted() {
        this.getMarketPrice()
        this.getMarketOpenPrice()
        this.refreshTransferTransactionList()
        this.refreshReceiptList()
        this.getPointInfo()
    }
}
