<template>
  <div class="transaction-details-header-outer-container">
    <div class="transaction-details-header-inner-container">
      <div
        v-for="({ key, value, isMosaic }, index) in items"
        :key="index"
        class="transaction-row-outer-container"
      >
        <TransactionDetailRow :label="key" :value="value" :is-mosaic="isMosaic" />
      </div>  
    </div>
  </div>
</template>

<script lang="ts">
import {TransactionDetailsHeaderTs} from './TransactionDetailsHeaderTs'
import './TransactionDetailsHeader.less'
export default class TransactionDetailsHeader extends TransactionDetailsHeaderTs {}
</script>
