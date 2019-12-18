import {TransactionType} from 'nem2-sdk'
import {mapState} from "vuex"
import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import {
    getCurrentMonthFirst, getCurrentMonthLast, formatNumber,
    renderMosaicNames, renderMosaicAmount
} from '@/core/utils'
import TransactionModal from '@/components/transaction-modal/TransactionModal.vue'
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
    chosenDate: Date = new Date()
    transactionDetails: any = []
    transferType = TransferType
    renderMosaicNames = renderMosaicNames
    renderMosaicAmount = renderMosaicAmount
    formatNumber = formatNumber  // @TODO: move to formatTransactions
    showDialog: boolean = false
    activeTransaction: FormattedTransaction = null

    @Prop({
        default: () => {
            return TransferType.SENT
        }
    })
    transactionType: number

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
            .filter(item => (item.isTxConfirmed
                && item.txHeader.date.getTime() <= currentMonthLast.getTime()
                && item.txHeader.date.getTime() >= currentMonthFirst.getTime()))

        if (!filteredByDate.length) return []

        return this.transactionType === TransferType.SENT
            ? filteredByDate.filter(({txHeader}) => txHeader.tag === 'payment')
            : filteredByDate.filter(({txHeader}) => txHeader.tag !== 'payment')
    }

    get mosaicList() {
        return this.activeAccount.mosaics
    }

    get currentHeight() {
        return this.app.NetworkProperties.height
    }

    get unConfirmedTransactionList() {
        return this.transferTransactionList.filter(({isTxConfirmed}) => !isTxConfirmed)
    }

    get currentMonthFirst(): Date {
        return getCurrentMonthFirst(this.chosenDate)
    }

    get currentMonthLast(): Date {
        return getCurrentMonthLast(this.chosenDate)
    }

    get displayedDate(): string {
        return this.$moment(this.chosenDate).format('YYYY MMM')
    }

    @Watch('wallet.address')
    onGetWalletChange() {
        this.chosenDate = new Date()
    }
}
