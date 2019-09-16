import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {
    getCurrentMonthFirst,
    getCurrentMonthLast,
    formatNumber,
    getRelativeMosaicAmount
} from '@/core/utils/utils.ts'
import {mapState} from "vuex"
import {TransferType} from '@/config/index.ts'
import {TransactionType} from 'nem2-sdk'

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

    get transactionList() {
        return this.activeAccount.transactionList
    }

    get transferTransactionList() {
        const {transactionList} = this
        return transactionList.filter(({rawTx})=> rawTx.type === TransactionType.TRANSFER)
    }

    get slicedConfirmedTransactionList() {
        const {currentMonthFirst, currentMonthLast, transferTransactionList} = this
        const filteredByDate = [...transferTransactionList]
            .filter(item => (!item.isTxUnconfirmed
                && item.txHeader.date <= currentMonthLast && item.txHeader.date >= currentMonthFirst))
        if (!filteredByDate.length) return []

        return this.transactionType === TransferType.SENT
        ? filteredByDate.filter(({txHeader}) => txHeader.tag === 'payment')
        : filteredByDate.filter(({txHeader}) => txHeader.tag !== 'payment')
    }
    
    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get unConfirmedTransactionList() {
        return this.transferTransactionList.filter(({isTxUnconfirmed}) => isTxUnconfirmed)
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
                value: transaction.isReceipt ? 'receipt' : 'payment'
            },
            {
                key: 'from',
                value: transaction.rawTx.signer.address.address
            },
            {
                key: 'aims',
                value: transaction.rawTx.recipient.address
            },
            // {
            //     key: 'mosaic',
            //     value: transaction.mosaic ? transaction.mosaic : null
            // },
            {
                key: 'fee',
                value: transaction.dialogDetailMap.fee
            },
            {
                key: 'block',
                value: transaction.txHeader.block
            },
            {
                key: 'hash',
                value: transaction.txHeader.hash
            },
            {
                key: 'message',
                value: transaction.rawTx.message.payload || 'N/A'
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
