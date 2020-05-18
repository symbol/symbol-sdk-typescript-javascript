import { Component, Vue, Watch } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { TransactionGroup } from '@/store/Transaction'
import { Signer } from '@/store/Account'

@Component({
  computed: {
    ...mapGetters({
      currentSigner: 'account/currentSigner',
      displayedTransactionStatus: 'transaction/displayedTransactionStatus',
    }),
  },
})
export class TransactionStatusFilterTs extends Vue {
  public currentSigner: Signer
  public displayedTransactionStatus: TransactionGroup

  public get selectedStatus(): TransactionGroup {
    return this.displayedTransactionStatus
  }
  public set selectedStatus(status: TransactionGroup) {
    this.$emit('status-change', status)
  }

  @Watch('currentSigner')
  onCurrentSignerChange() {
    this.$store.commit('transaction/setDisplayedTransactionStatus', TransactionGroup.all)
  }
}
