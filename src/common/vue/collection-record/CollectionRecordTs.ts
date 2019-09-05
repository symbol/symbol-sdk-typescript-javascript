import {PublicAccount} from 'nem2-sdk'
import {TransactionApiRxjs} from '@/core/api/TransactionApiRxjs.ts'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {TransferType} from '@/config/index.ts'
import transacrionAssetIcon from '@/common/img/monitor/transaction/txConfirmed.png'
import {
    formatTransactions,
    getCurrentMonthFirst,
    getCurrentMonthLast,
    formatNumber,
    getRelativeMosaicAmount
} from '@/core/utils/utils.ts'
import {getBlockInfoByTransactionList} from '@/core/utils/wallet.ts'
import {mapState} from "vuex"
import {getMosaicInfoList} from "@/core/utils/wallet"
import {MosaicApiRxjs} from "@/core/api/MosaicApiRxjs"


@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class CollectionRecordTs extends Vue {
    activeAccount: any
    app: any
    currentPrice = 0
    transactionHash = ''
    isShowDialog = false
    isShowSearchDetail = false
    currentMonthLast: any = 0
    confirmedTransactionList = []
    currentMonthFirst: number = 0
    localConfirmedTransactions = []
    unConfirmedTransactionList = []
    localUnConfirmedTransactions = []
    isLoadingTransactionRecord = true
    currentMonth: string = ''
    isLoadingModalDetailsInfo = false
    transacrionAssetIcon = transacrionAssetIcon
    transactionDetails: any = []

    @Prop({
        default: () => {
            return 0
        }
    })
    transactionType

    get getWallet() {
        return this.activeAccount.wallet
    }

    get UnconfirmedTxList() {
        return this.activeAccount.UnconfirmedTx
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get accountPrivateKey() {
        return this.activeAccount.wallet.privateKey
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get timeZone() {
        return this.app.timeZone
    }

    get xemDivisibility() {
        return this.activeAccount.xemDivisibility
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }


    get node() {
        return this.activeAccount.node
    }


    hideSearchDetail() {
        this.isShowSearchDetail = false
    }

    changeCurrentMonth(e) {
        this.currentMonth = e
    }

    formatNumber(number) {
        return formatNumber(number)
    }


    async getConfirmedTransactions() {
        const that = this
        let {accountPublicKey, currentXEM1, accountAddress, node, transactionType} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType)
        await new TransactionApiRxjs().transactions(
            publicAccount,
            {
                pageSize: 100
            },
            node,
        ).subscribe(async (transactionsInfo) => {
                let transferTransactionList = formatTransactions(transactionsInfo, accountAddress, currentXEM1)
                // get transaction by choose recript tx or send
                if (transactionType == TransferType.RECEIVED) {
                    transferTransactionList.forEach((item) => {
                        if (item.isReceipt) {
                            that.localConfirmedTransactions.push(item)
                        }
                    })
                    try {
                        await that.getBlockInfoByTransactionList(that.localConfirmedTransactions, node)
                    } catch (e) {
                        console.log(e)
                    } finally {
                        that.onCurrentMonthChange()
                    }
                    return
                }

                transferTransactionList.forEach((item) => {
                    if (!item.isReceipt) {
                        that.localConfirmedTransactions.push(item)
                    }
                })
                try {
                    await that.getBlockInfoByTransactionList(that.localConfirmedTransactions, node)
                    await that.getRelativeMosaicByTransaction(that.localConfirmedTransactions, node)
                } catch (e) {
                    console.log(e)
                } finally {
                    that.onCurrentMonthChange()
                }

            }
        )
    }

    initDialogData(transaction) {
        this.isShowDialog = true
        this.transactionDetails = [
            {
                key: 'transfer_type',
                value: transaction.isReceipt ? 'gathering' : 'payment'
            },
            {
                key: 'from',
                value: transaction.signerAddress
            },
            {
                key: 'aims',
                value: transaction.recipientAddress
            },
            {
                key: 'mosaic',
                value: transaction.mosaic ? transaction.mosaic : null
            },
            {
                key: 'fee',
                value: getRelativeMosaicAmount(transaction.maxFee.compact(), 6) + 'XEM'
            },
            {
                key: 'block',
                value: transaction.transactionInfo.height.compact()
            },
            {
                key: 'hash',
                value: transaction.transactionInfo.hash
            },
            {
                key: 'message',
                value: transaction.message.payload
            }
        ]
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
        const mosaicIdList = transactionMosaicList.map((item) => {
            return item.id
        })
        new MosaicApiRxjs().getMosaics(node, mosaicIdList).subscribe((mosaicInfoList: any) => {
            mosaicInfoList.forEach(mosaicInfo => {
                MosaicDivisibilityMap[mosaicInfo.mosaicId.toHex()] = {
                    divisibility: mosaicInfo.properties.divisibility
                }
            })
            transaction.mosaic = transactionMosaicList.map((item) => {
                const mosaicHex = item.id.id.toHex() + ''
                return mosaicHex + `(${getRelativeMosaicAmount(item.amount.compact(), MosaicDivisibilityMap[mosaicHex].divisibility)})`
            }).join(',')
            that.transactionDetails = transaction
            that.initDialogData(transaction)
            that.isLoadingModalDetailsInfo = false
        })

    }

    getRelativeMosaicByTransaction(transactionList, node) {
        let resultList = transactionList
        const that = this
        this.isLoadingTransactionRecord = true
        if (transactionList.length != 0) {
            Promise.all(transactionList.map(async (item, index) => {
                if (item.mosaics.length == 1) {
                    const amount = item.mosaics[0].amount.compact()
                    const mosaicInfoList = await getMosaicInfoList(node, [item.mosaics[0].id])
                    const mosaicInfo: any = mosaicInfoList[0]
                    resultList[index].mosaicAmount = item.isReceipt ? '+' : '-' + getRelativeMosaicAmount(amount, mosaicInfo.properties.divisibility)
                }
            })).then(() => {
                that.isLoadingTransactionRecord = false
                that.localConfirmedTransactions = [...resultList]
            }).catch((e) => {
                console.log(e)
            })
        }
    }

    getBlockInfoByTransactionList(transactionList, node) {
        const {timeZone} = this
        getBlockInfoByTransactionList(transactionList, node, timeZone)
    }


    async getUnConfirmedTransactions() {
        const that = this
        let {accountPublicKey, currentXEM1, accountAddress, node, transactionType} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType)
        await new TransactionApiRxjs().unconfirmedTransactions(
            publicAccount,
            {
                pageSize: 100
            },
            node,
        ).subscribe(async (transactionsInfo) => {
            let transferTransactionList = formatTransactions(transactionsInfo, accountAddress, currentXEM1)
            // get transaction by choose recript tx or send
            if (transactionType == TransferType.RECEIVED) {
                transferTransactionList.forEach((item) => {
                    if (item.isReceipt) {
                        that.localUnConfirmedTransactions.push(item)
                    }
                })
                that.getRelativeMosaicByTransaction(that.localConfirmedTransactions, node)
                that.onCurrentMonthChange()
                that.isLoadingTransactionRecord = false
                return
            }
            transferTransactionList.forEach((item) => {
                if (!item.isReceipt) {
                    that.localUnConfirmedTransactions.push(item)
                }
            })
            that.onCurrentMonthChange()
            that.isLoadingTransactionRecord = false
        })
    }

    initData() {
        this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
    }

    @Watch('getWallet.address')
    onGetWalletChange() {
        this.initData()
        this.getConfirmedTransactions()
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.isLoadingTransactionRecord = true
        this.getConfirmedTransactions()
    }

    @Watch('UnconfirmedTxList')
    onUnconfirmedTxChange() {
        this.isLoadingTransactionRecord = true
        this.getUnConfirmedTransactions()
    }

    // month filter
    @Watch('currentMonth')
    onCurrentMonthChange() {
        this.confirmedTransactionList = []
        const that = this
        const currentMonth = new Date(this.currentMonth)
        let currentConfirmedTxList = []
        let currentUnConfirmedTxList = []
        this.currentMonthFirst = getCurrentMonthFirst(currentMonth)
        this.currentMonthLast = getCurrentMonthLast(currentMonth)
        const {currentMonthFirst, currentMonthLast, localConfirmedTransactions, localUnConfirmedTransactions} = this
        localConfirmedTransactions.forEach((item) => {
            if (item.date <= currentMonthLast && item.date >= currentMonthFirst) {
                currentConfirmedTxList.push(item)
            }
        })

        that.confirmedTransactionList = currentConfirmedTxList
        localUnConfirmedTransactions.forEach((item) => {
            if (item.date <= currentMonthLast && item.date >= currentMonthFirst) {
                currentUnConfirmedTxList.push(item)
            }
        })
        that.unConfirmedTransactionList = currentUnConfirmedTxList
    }

    created() {
        this.initData()
        this.getConfirmedTransactions()
        this.getUnConfirmedTransactions()
    }
}
