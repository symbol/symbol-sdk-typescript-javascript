<template>
  <div class="transaction-details-header-outer-container">
    <div class="transaction-details-header-inner-container">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="transaction-row-outer-container"
      >
        <TransactionDetailRow :item="item" />
      </div>  
    </div>
  </div>
</template>

<script lang="ts">
import {TransactionDetailsHeaderTs} from './TransactionDetailsHeaderTs'
import './TransactionDetailsHeader.less'
export default class TransactionDetailsHeader extends TransactionDetailsHeaderTs {}
</script>
