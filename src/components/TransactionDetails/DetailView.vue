<script>
import GenericTransactionDetailView from '@/components/TransactionDetails/GenericTransactionDetailView.vue'

export default {
  // Using a funcional patterns helps with performance for the conditional rendering of many components
  functional: true,
  render: (h, { data }) => {
    //Add if per transaction type is required. At the moment the generic solution works well for all.
    return <GenericTransactionDetailView {...data} />
  },
}
</script>
