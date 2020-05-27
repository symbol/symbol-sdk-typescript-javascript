<template>
  <div class="transaction-details-header-outer-container">
    <div class="transaction-details-header-inner-container">
      <div v-for="(item, index) in view.headerItems" :key="index" class="transaction-row-outer-container">
        <TransactionDetailRow :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TransactionDetailsHeaderTs } from './TransactionDetailsHeaderTs'

export default class TransactionDetailsHeader extends TransactionDetailsHeaderTs {}
</script>
<style lang="less" scoped>
@import './TransactionDetailsHeader.less';
</style>
