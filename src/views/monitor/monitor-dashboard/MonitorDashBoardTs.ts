import {market} from "@/core/api/logicApi.ts"
import {PublicAccount, NetworkType} from 'nem2-sdk'
import {KlineQuery} from "@/core/query/klineQuery.ts"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import {transactionFormat} from '@/core/utils/format.ts'
import {Component, Vue, Watch} from 'vue-property-decorator'
import LineChart from '@/common/vue/line-chart/LineChart.vue'
import numberGrow from '@/common/vue/number-grow/NumberGrow.vue'
import {getBlockInfoByTransactionList} from "@/core/utils/wallet"
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {isRefreshData, localSave, localRead} from '@/core/utils/utils.ts'
import dashboardBlockTime from '@/common/img/monitor/dash-board/dashboardBlockTime.png'
import dashboardPublickey from '@/common/img/monitor/dash-board/dashboardPublickey.png'
import dashboardBlockHeight from '@/common/img/monitor/dash-board/dashboardBlockHeight.png'
import dashboardPointAmount from '@/common/img/monitor/dash-board/dashboardPointAmount.png'
import dashboardTransactionAmount from '@/common/img/monitor/dash-board/dashboardTransactionAmount.png'


@Component({
    components: {
        LineChart,
        numberGrow
    }
})
export class MonitorDashBoardTs extends Vue {
    node = ''
    currentXem = ''
    accountAddress = ''
    updateAnimation = ''
    isShowDialog = false
    isShowInnerDialog = false
    currentInnerTransaction = {}
    accountPublicKey = ''
    currentDataAmount = 0
    currentPrice: any = 0
    accountPrivateKey = ''
    transferListLength = 0
    receiptListLength = 0
    currentTransactionList = []
    xemNum: number = 8999999999
    allTransacrionList = []
    transferTransactionList = []
    isLoadingTransactions = false
    receiptList = []
    showConfirmedTransactions = true
    transactionDetails = {}
    networkStatusList = [
        {
            icon: dashboardBlockHeight,
            descript: 'block_height',
            data: 1978365,
            variable: 'currentHeight'

        }, {
            icon: dashboardBlockTime,
            descript: 'average_block_time',
            data: 12,
            variable: 'currentGenerateTime'
        }, {
            icon: dashboardPointAmount,
            descript: 'point',
            data: 4,
            variable: 'nodeAmount'
        }, {
            icon: dashboardTransactionAmount,
            descript: 'number_of_transactions',
            data: 0,
            variable: 'numTransactions'
        }, {
            icon: dashboardPublickey,
            descript: 'Harvester',
            data: 0,
            variable: 'signerPublicKey'
        }
    ]


    get getWallet() {
        return this.$store.state.account.wallet
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }


    get currentHeight() {
        return this.$store.state.app.chainStatus.currentHeight
    }
    showDialog(transaction) {
        this.isShowDialog = true
        this.transactionDetails = transaction
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
        const rstStr = await market.kline({period: "1min", symbol: "xemusdt", size: "1"});
        const rstQuery: KlineQuery = JSON.parse(rstStr.rst);
        const result = rstQuery.data ? rstQuery.data[0].close : 0
        that.currentPrice = result * that.xemNum
        const openPriceOneMinute = {
            timestamp: new Date().getTime(),
            openPrice: result
        }
        localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))

    }

    switchTransactionPanel(flag) {
        this.showConfirmedTransactions = flag
        this.currentDataAmount = flag ? this.transferListLength : this.receiptListLength
        this.changePage(1)
    }

    getPointInfo() {
        const that = this
        const node = this.$store.state.account.node
        const {currentBlockInfo, preBlockInfo} = this.$store.state.app.chainStatus
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
        let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
        if (!accountPublicKey || accountPublicKey.length < 64) return
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
        new TransactionApiRxjs().transactions(
            publicAccount,
            {
                pageSize: 100
            },
            node,
        ).subscribe(async (transactionsInfo) => {
            that.allTransacrionList.push(...transactionsInfo)
            try {
                await that.getBlockInfoByTransactionList(that.allTransacrionList, node)
            } catch (e) {
                console.log(e)
            }
        })
    }

    refreshReceiptList() {
        const that = this
        let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
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
            that.allTransacrionList.push(...unconfirmedtransactionsInfo)
            try {
                await that.getBlockInfoByTransactionList(that.allTransacrionList, node)
            } catch (e) {
                console.log(e)
            }
        })
    }

    initData() {
        if (!this.getWallet) {
            return
        }
        this.accountPrivateKey = this.getWallet.privateKey
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
    }

    changePage(page) {
        const pageSize = 10
        const {showConfirmedTransactions, node} = this
        const start = (page - 1) * pageSize
        const end = page * pageSize
        if (showConfirmedTransactions) {
            this.currentTransactionList = this.transferTransactionList.slice(start, end)
            return
        }
        this.currentTransactionList = this.receiptList.slice(start, end)
    }


    getBlockInfoByTransactionList(transactionList, node) {
        const offset = this.$store.state.app.timeZone
        getBlockInfoByTransactionList(transactionList, node, offset)
    }


    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.refreshReceiptList()
        this.refreshTransferTransactionList()
        this.getMarketOpenPrice()
        this.getPointInfo()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.allTransacrionList = []
        this.refreshReceiptList()
        this.refreshTransferTransactionList()
    }

    @Watch('allTransacrionList')
    onAllTransacrionListChange() {
        const currentXEM = this.$store.state.account.currentXEM1
        const {allTransacrionList, accountAddress, showConfirmedTransactions} = this
        const transactionList = transactionFormat(allTransacrionList, accountAddress, currentXEM)
        this.transferTransactionList = transactionList.transferTransactionList
        this.receiptList = transactionList.receiptList
        this.changePage(1)
        this.transferListLength = this.transferTransactionList.length
        this.receiptListLength = this.receiptList.length
        this.currentDataAmount = showConfirmedTransactions ? this.transferListLength : this.receiptListLength
        this.isLoadingTransactions = false
    }


    @Watch('currentHeight')
    onChainStatus() {
        this.updateAnimation = 'appear'
        setTimeout(() => {
            this.updateAnimation = 'appear'
        }, 500)
    }

    created() {

        this.initData()
        this.getMarketOpenPrice()
        this.refreshTransferTransactionList()
        this.refreshReceiptList()
        this.getPointInfo()
    }

}
