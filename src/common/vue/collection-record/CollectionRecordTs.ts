import {TransactionType} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {
    getCurrentMonthFirst, getCurrentMonthLast, formatNumber,
    renderMosaics, renderMosaicNames, renderMosaicAmount
} from '@/core/utils'
import TransactionModal from '@/views/monitor/monitor-transaction-modal/TransactionModal.vue'
import {TransferType} from "@/core/model/TransferType"
import {StoreAccount, AppInfo, FormattedTransaction} from "@/core/model"

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {TransactionModal},
})
export class CollectionRecordTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    transactionHash = ''
    isShowSearchDetail = false
    currentMonthLast: Date
    currentMonthFirst: Date
    currentMonth: string = ''
    transactionDetails: any = []
    transferType = TransferType
    renderMosaics = renderMosaics
    renderMosaicNames = renderMosaicNames
    renderMosaicAmount = renderMosaicAmount

    showDialog: boolean = false
    activeTransaction: FormattedTransaction = null

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
        return transactionList.filter(({rawTx}) => rawTx.type === TransactionType.TRANSFER)
    }

    get slicedConfirmedTransactionList() {
        const {currentMonthFirst, currentMonthLast, transferTransactionList} = this
        const filteredByDate = [...transferTransactionList]
            .filter(item => (!item.isTxUnconfirmed && item.txHeader.date.getTime() <= currentMonthLast.getTime()  && item.txHeader.date.getTime() >= currentMonthFirst.getTime() ))
        if (!filteredByDate.length) return []

        return this.transactionType === TransferType.SENT
            ? filteredByDate.filter(({txHeader}) => txHeader.tag === 'payment')
            : filteredByDate.filter(({txHeader}) => txHeader.tag !== 'payment')
    }

    get mosaicList() {
        return this.activeAccount.mosaics
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }

    get currentHeight() {
        return this.app.chainStatus.currentHeight
    }

    get unConfirmedTransactionList() {
        return this.transferTransactionList.filter(({isTxUnconfirmed}) => isTxUnconfirmed)
    }

    hideSearchDetail() {
        this.isShowSearchDetail = false
    }

    changeCurrentMonth(e) {
        this.currentMonth = e
    }

    // @TODO: move to formatTransactions
    formatNumber(number) {
        return formatNumber(number)
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
