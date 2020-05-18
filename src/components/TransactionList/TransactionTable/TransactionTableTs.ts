// external dependenies
import { Component, Prop, Vue } from 'vue-property-decorator'
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
  computed: mapGetters({
    isFetchingTransactions: 'transaction/isFetchingTransactions',
  }),
})
export class TransactionTableTs extends Vue {
  @Prop({ default: [] })
  public transactions: Transaction[]

  @Prop({ default: 'no_data_transactions' })
  public emptyMessage: string

  public nodata = [...Array(10).keys()]

  /**
   * Whether transactios are currently being fetched
   * @protected
   * @type {boolean}
   */
  protected isFetchingTransactions: boolean
}
