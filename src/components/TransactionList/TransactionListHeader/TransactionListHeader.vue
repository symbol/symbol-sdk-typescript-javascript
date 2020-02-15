<template>
  <div class="transaction-header-container transaction-table-columns">
    <div class="icon-header">
      <span>&nbsp;</span>
    </div>
    <div class="address-header">
      <span>{{ $t('from_to_action') }}</span>
    </div>
    <div class="amount-header">
      <span>{{ $t('amount_asset') }}</span>
    </div>
    <div class="confirmation-header">
      <span>{{ $t('confirmations_height') }}</span>
    </div>
    <div class="hash-header">
      <span>{{ $t('hash_date') }}</span>
    </div>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class TransactionListHeader extends Vue {}
</script>

<style scoped lang="less">
@import "./TransactionListHeader.less";
</style>
