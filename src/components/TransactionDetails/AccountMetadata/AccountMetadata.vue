<template>
  <div class="transaction-details-item-inner-container">
    <div v-for="(item, index) in view.items" :key="index" class="transaction-row-outer-container">
      <TransactionDetailRow :item="item" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

// internal dependencies
import { TransactionViewType } from '@/services/TransactionService'

// child components
import TransactionDetailRow from '@/components/TransactionDetails/TransactionDetailRow/TransactionDetailRow.vue'

@Component({ components: { TransactionDetailRow } })
export default class AccountMetadata extends Vue {
  @Prop({ default: null }) view: TransactionViewType
}
</script>

<style lang="less" scoped>
@import '../TransactionDetails.less';
</style>
