// external dependenies
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Transaction } from 'symbol-sdk'
import { mapGetters } from 'vuex'

// child components
// @ts-ignore
import TransactionRow from '@/components/TransactionList/TransactionRow/TransactionRow.vue'
// @ts-ignore
import TransactionListHeader from '@/components/TransactionList/TransactionListHeader/TransactionListHeader.vue'

@Component({
  components: {
    TransactionRow,
    TransactionListHeader,
  },
  computed: mapGetters({ isFetchingTransactions: 'app/isFetchingTransactions',partialTransactions:'wallet/partialTransactions'}),
})
export class TransactionTableTs extends Vue {
  @Prop({ default: [] }) transactions: Transaction[]
  @Prop({ default: 'no_data_transactions'}) emptyMessage: string
  public nodata = [...Array(10).keys()]


  /**
   * List of confirmed transactions (websocket only)
   * @see {Store.Wallet}
   * @var {Transaction[]}
   */
  public partialTransactions: Transaction[]

  /**
   * Whether transactios are currently being fetched
   * @protected
   * @type {boolean}
   */
  protected isFetchingTransactions: boolean

  get transactionsList(): Transaction[] {
    return this.transactions
  }
  public getTransactionStatus(transaction) {
    if (transaction.isConfirmed()) {
      return 'confirmed'
    } else {
      if (this.partialTransactions.length > 0 &&
         this.partialTransactions.some((item) => item.transactionInfo.hash === transaction.transactionInfo.hash)) {
        return 'partial'
      } else {
        return 'unconfirmed'
      }
    }
  }
}
