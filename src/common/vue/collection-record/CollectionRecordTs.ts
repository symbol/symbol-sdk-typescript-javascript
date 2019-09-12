import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {
    getCurrentMonthFirst,
    getCurrentMonthLast,
    formatNumber,
    getRelativeMosaicAmount
} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {TransferType} from '@/config/index.ts'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class CollectionRecordTs extends Vue {
    activeAccount: any
    app: any
    transactionHash = ''
    isShowDialog = false
    isShowSearchDetail = false
    currentMonthLast: any = 0
    currentMonthFirst: number = 0
    currentMonth: string = ''
    transactionDetails: any = []
    TransferType = TransferType

    @Prop({
        default: () => {
            return 0
        }
    })
    transactionType

    get wallet() {
        return this.activeAccount.wallet
    }

    get transactionsLoading() {
        return this.app.transactionsLoading
    }

    get confirmedTransactionList() {
        return this.activeAccount.transactionList.transferTransactionList
    }

    get slicedConfirmedTransactionList() {
        const {currentMonthFirst, currentMonthLast, confirmedTransactionList} = this
        const filteredByDate = [...confirmedTransactionList]
            .filter(item => (!item.isTxUnconfirmed
                && item.date <= currentMonthLast && item.date >= currentMonthFirst))
        if (!filteredByDate.length) return []
        return this.transactionType === TransferType.SENT
            ? filteredByDate.filter(({tag}) => tag === 'payment')
            : filteredByDate.filter(({tag}) => tag !== 'payment')
    }
    
    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get unConfirmedTransactionList() {
        return [...this.confirmedTransactionList].filter(({isTxUnconfirmed}) => isTxUnconfirmed)
    }

    changeCurrentMonth(e) {
        this.currentMonth = e
    }

    // @TODO: move to formatTransactions
    formatNumber(number) {
        return formatNumber(number)
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
                value: transaction.signer.address.address
            },
            {
                key: 'aims',
                value: transaction.recipient.address
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
                value: transaction.message.payload || 'N/A'
            }
        ]
    }

    // @TODO: the current month should probably be set at app creation to the store
    // And defaulted from the store in here
    setCurrentMonth() {
        this.currentMonth = (new Date()).getFullYear() + '-' + ((new Date()).getMonth() + 1)
    }

    @Watch('wallet.address')
    onGetWalletChange() {
        this.setCurrentMonth()
    }

    // month filter
    @Watch('currentMonth')
    onCurrentMonthChange() {
        const currentMonth = new Date(this.currentMonth)
        this.currentMonthFirst = getCurrentMonthFirst(currentMonth)
        this.currentMonthLast = getCurrentMonthLast(currentMonth)
    }

    mounted() {
        this.setCurrentMonth()
    }
}
