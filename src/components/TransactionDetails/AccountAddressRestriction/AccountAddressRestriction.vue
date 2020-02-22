<template>
  <div class="transaction-details-item-inner-container">
    <div
      v-for="([ key, value ], index) in Array.from(view.values.entries())"
      :key="index"
      class="transaction-row-outer-container"
    >
      <TransactionDetailRow :label="key" :value="value" />
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator'

// internal dependencies
import {TransactionViewType} from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class AccountAddressRestriction extends Vue {
  @Prop({ default: null }) view: TransactionViewType
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
