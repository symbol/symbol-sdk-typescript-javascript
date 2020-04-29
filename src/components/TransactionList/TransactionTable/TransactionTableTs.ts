// external dependenies
import {Component, Prop, Vue} from 'vue-property-decorator'
import {Transaction} from 'symbol-sdk'
import {mapGetters} from 'vuex'
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
  computed: mapGetters({
    isFetchingTransactions: 'transaction/isFetchingTransactions',
    partialTransactions: 'transaction/partialTransactions',
  }),
})
export class TransactionTableTs extends Vue {

  @Prop({default: []})
  public transactions: Transaction[]

  @Prop({default: 'no_data_transactions'})
  public emptyMessage: string

  public nodata = [...Array(10).keys()]


  /**
   * List of confirmed transactions (websocket only)
   * @see {Store.Account}
   * @var {Transaction[]}
   */
  public partialTransactions: Transaction[]

  /**
   * Whether transactios are currently being fetched
   * @protected
   * @type {boolean}
   */
  protected isFetchingTransactions: boolean

  public getTransactionStatus(transaction) {
    if (transaction.isConfirmed()) {
      return 'confirmed'
    } else {
      if (this.partialTransactions.length > 0 &&
        this.partialTransactions.some(
          (item) => item.transactionInfo.hash === transaction.transactionInfo.hash)) {
        return 'partial'
      } else {
        return 'unconfirmed'
      }
    }
  }
}
