<template>
  <div v-if="views.length" class="transaction-details-main-container">
    <div class="transaction-details-header-container">
      <TransactionDetailsHeader :view="views[0]" />
    </div>
    <div class="transaction-details-detail-section-title-container">
      <span class="transaction-details-detail-section-title">
        {{ $t('transaction_details') }}
      </span>
    </div>
    <div class="transaction-details-outer-container">
      <div v-for="(view, index) in views" :key="index">
        <!-- There are more than one view if the transaction is an aggregate, -->
        <!-- skipping the first of many views avoid rendering an aggregate wrapper in details -->
        <DetailView v-if="!(views.length > 1 && index === 0)" :view="view" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TransactionDetailsTs } from './TransactionDetailsTs'
export default class TransactionDetails extends TransactionDetailsTs {}
</script>

<style lang="less">
@import './TransactionDetails.less';
</style>
