import {market} from "@/core/api/logicApi"
import {KlineQuery} from "@/core/query/klineQuery"
import {PublicAccount, NetworkType} from 'nem2-sdk'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {blockchainApi} from '@/core/api/blockchainApi'
import LineChart from '@/common/vue/line-chart/LineChart.vue'
import {transactionApi} from '@/core/api/transactionApi'
import numberGrow from '@/common/vue/number-grow/NumberGrow.vue'
import {transactionFormat} from '@/core/utils/format'
import {isRefreshData, localSave, localRead, formatTransactions} from '@/core/utils/utils.js'
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
    accountPublicKey = ''
    currentDataAmount = 0
    currentPrice: any = 0
    accountPrivateKey = ''
    confirmedDataAmount = 0
    unconfirmedDataAmount = 0
    currentTransactionList = []
    xemNum: number = 8999999999
    isLoadingConfirmedTx = true
    confirmedTransactionList = []
    isLoadingUnconfirmedTx = false
    unconfirmedTransactionList = []
    showConfirmedTransactions = true
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
    transactionDetails = {}


    get getWallet() {
        return this.$store.state.account.wallet
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    showDialog(transaction) {
        this.isShowDialog = true
        console.log(transaction.dialogDetailMap)
        this.transactionDetails = transaction.dialogDetailMap
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
        const result = rstQuery.data[0].close
        that.currentPrice = result * that.xemNum
        const openPriceOneMinute = {
            timestamp: new Date().getTime(),
            openPrice: result
        }
        localSave('openPriceOneMinute', JSON.stringify(openPriceOneMinute))

    }

    switchTransactionPanel(flag) {
        this.showConfirmedTransactions = flag
        this.currentDataAmount = flag ? this.confirmedDataAmount : this.unconfirmedDataAmount
        this.changePage(1)
    }

    getPointInfo() {
        const that = this
        const node = this.$store.state.account.node
        const {currentBlockInfo, preBlockInfo} = this.$store.state.app.chainStatus
        blockchainApi.getBlockchainHeight({
            node
        }).then((result) => {
            result.result.blockchainHeight.subscribe((res) => {
                const height = Number.parseInt(res.toHex(), 16)
                that.$store.state.app.chainStatus.currentHeight = height
                blockchainApi.getBlockByHeight({
                    node,
                    height: height
                }).then((blockInfo) => {
                    blockInfo.result.Block.subscribe((block) => {
                        that.$store.state.app.chainStatus.numTransactions = block.numTransactions ? block.numTransactions : 0   //num
                        that.$store.state.app.chainStatus.signerPublicKey = block.signer.publicKey
                        that.$store.state.app.chainStatus.currentHeight = block.height.compact()    //height
                        that.$store.state.app.chainStatus.currentBlockInfo = block
                        that.$store.state.app.chainStatus.currentGenerateTime = 12
                    })
                })
            })
        })
    }


    getConfirmedTransactions() {
        const that = this
        let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
        transactionApi.transactions({
            publicAccount,
            node,
            queryParams: {
                pageSize: 100
            }
        }).then((transactionsResult) => {
            transactionsResult.result.transactions.subscribe((transactionsInfo) => {
                let transferTransaction = transactionFormat(transactionsInfo, accountAddress)
                // let transferTransaction = formatTransactions(transactionsInfo, accountAddress)
                that.changeCurrentTransactionList(transferTransaction.slice(0, 10))
                that.confirmedDataAmount = transferTransaction.length
                that.currentDataAmount = transferTransaction.length
                that.confirmedTransactionList = transferTransaction
                that.isLoadingConfirmedTx = false
                // console.log(transferTransaction)
            })
        })
    }

    getUnconfirmedTransactions() {
        const that = this
        let {accountPrivateKey, accountPublicKey, currentXem, accountAddress, node} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, NetworkType.MIJIN_TEST)
        transactionApi.unconfirmedTransactions({
            publicAccount,
            node,
            queryParams: {
                pageSize: 100
            }
        }).then((transactionsResult) => {
            transactionsResult.result.unconfirmedTransactions.subscribe((unconfirmedtransactionsInfo) => {
                let transferTransaction = formatTransactions(unconfirmedtransactionsInfo, accountAddress)
                that.changeCurrentTransactionList(transferTransaction.slice(0, 10))
                that.currentDataAmount = transferTransaction.length
                that.unconfirmedDataAmount = transferTransaction.length
                that.unconfirmedTransactionList = transferTransaction
                that.isLoadingUnconfirmedTx = false
            })
        })
    }

    initData() {
        this.accountPrivateKey = this.getWallet.privateKey
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentXem = this.$store.state.account.currentXem
    }

    changeCurrentTransactionList(list: Array<any>) {
        this.currentTransactionList = list
    }

    changePage(page) {
        const pageSize = 10
        const {showConfirmedTransactions} = this
        const start = (page - 1) * pageSize
        const end = page * pageSize
        if (showConfirmedTransactions) {
            //confirmed
            this.changeCurrentTransactionList(this.confirmedTransactionList.slice(start, end))
            return
        }
        this.changeCurrentTransactionList(this.unconfirmedTransactionList.slice(start, end))
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.initData()
        this.getUnconfirmedTransactions()
        this.getConfirmedTransactions()
        this.getMarketOpenPrice()
        this.getPointInfo()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.getUnconfirmedTransactions()
        this.getConfirmedTransactions()
    }

    get currentHeight() {
        return this.$store.state.app.chainStatus.currentHeight
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
        this.getConfirmedTransactions()
        this.getUnconfirmedTransactions()
        this.getPointInfo()
    }

}
