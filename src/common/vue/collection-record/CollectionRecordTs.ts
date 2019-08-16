import {PublicAccount} from 'nem2-sdk'
import {transactionApi} from '@/core/api/transactionApi'
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import transacrionAssetIcon from '@/common/img/monitor/transaction/txConfirmed.png'
import {formatTransactions, getCurrentMonthFirst, getCurrentMonthLast,} from '@/core/utils/utils'


@Component
export class CollectionRecordTs extends Vue {
    node = ''
    currentPrice = 0
    currentMonth = ''
    accountAddress = ''
    transactionHash = ''
    isShowDialog = false
    accountPublicKey = ''
    accountPrivateKey = ''
    isShowSearchDetail = false
    currentMonthLast: any = 0
    confirmedTransactionList = []
    currentMonthFirst: number = 0
    localConfirmedTransactions = []
    unConfirmedTransactionList = []
    localUnConfirmedTransactions = []
    isLoadingTransactionRecord = true
    transacrionAssetIcon = transacrionAssetIcon
    transactionDetails = [
        {
            key: 'transfer_type',
            value: 'gathering'
        },
        {
            key: 'from',
            value: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
        },
        {
            key: 'aims',
            value: 'Test wallet'
        },
        {
            key: 'the_amount',
            value: '10.000000XEM'
        },
        {
            key: 'fee',
            value: '0.050000000XEM'
        },
        {
            key: 'block',
            value: '1951249'
        },
        {
            key: 'hash',
            value: '9BBCAECDD5E2D04317DE9873DC99255A9F8A33FA5BB570D1353F65CB31A44151'
        },
        {
            key: 'message',
            value: 'message test this'
        }
    ]

    @Prop({
        default: () => {
            return 0
        }
    })
    transactionType

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get UnconfirmedTxList() {
        return this.$store.state.account.UnconfirmedTx
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    hideSearchDetail() {
        this.isShowSearchDetail = false
    }

    changeCurrentMonth(e) {
        this.currentMonth = e
    }

    showDialog(transaction) {
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
                value: transaction.mosaic ? transaction.mosaic.id.toHex().toUpperCase() : null
            },
            {
                key: 'the_amount',
                value: transaction.mosaic ? transaction.mosaic.amount.compact() : 0
            },
            {
                key: 'fee',
                value: transaction.maxFee.compact()
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

    async getConfirmedTransactions() {
        const that = this
        const {currentXEM1} = this.$store.state.account
        let {accountPublicKey, accountAddress, node, transactionType} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType)
        await transactionApi.transactions({
            publicAccount,
            node,
            queryParams: {
                pageSize: 100
            }
        }).then((transactionsResult) => {
            transactionsResult.result.transactions.subscribe((transactionsInfo) => {
                let transferTransaction = formatTransactions(transactionsInfo, accountAddress, currentXEM1)
                let list = []
                // get transaction by choose recript tx or send
                if (transactionType == 1) {
                    transferTransaction.forEach((item) => {
                        if (item.isReceipt) {
                            list.push(item)
                        }
                    })
                    that.localConfirmedTransactions = list
                    that.onCurrentMonthChange()
                    that.isLoadingTransactionRecord = false
                    return
                }

                transferTransaction.forEach((item) => {
                    if (!item.isReceipt) {
                        list.push(item)
                    }
                })
                that.localConfirmedTransactions = list
                that.onCurrentMonthChange()
                that.isLoadingTransactionRecord = false
            })
        })
    }

    async getUnConfirmedTransactions() {
        const that = this
        const {currentXEM1} = this.$store.state.account
        let {accountPublicKey, accountAddress, node, transactionType, UnconfirmedTxList} = this
        const publicAccount = PublicAccount.createFromPublicKey(accountPublicKey, this.getWallet.networkType)
        await transactionApi.unconfirmedTransactions({
            publicAccount,
            node,
            queryParams: {
                pageSize: 100
            }
        }).then((transactionsResult) => {
            transactionsResult.result.unconfirmedTransactions.subscribe((transactionsInfo) => {
                let transferTransaction = formatTransactions(transactionsInfo, accountAddress, currentXEM1)
                let list = []
                // get transaction by choose recript tx or send
                if (transactionType == 1) {
                    transferTransaction.forEach((item) => {
                        if (item.isReceipt) {
                            list.push(item)
                        }
                    })
                    that.localUnConfirmedTransactions = list
                    that.onCurrentMonthChange()
                    that.isLoadingTransactionRecord = false
                    return
                }
                transferTransaction.forEach((item) => {
                    if (!item.isReceipt) {
                        list.push(item)
                    }
                })
                that.localUnConfirmedTransactions = list
                that.onCurrentMonthChange()
                that.isLoadingTransactionRecord = false
            })
        })
    }

    initData() {
        this.accountPrivateKey = this.getWallet.privateKey
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
        this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
    }

    @Watch('getWallet')
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
