<template>
  <div class="transaction-details-container">

    <div class="details-row">
      <span>{{ $t('recipient') }}：</span>
      <span class="value">{{ recipient }}</span>
    </div>

    <div class="details-row">
      <span>{{ $t('mosaics') }}：</span>
      <div v-for="(entry, index) in mosaics" :key="index" class="value">
        <MosaicAmountDisplay :id="entry.id" :relative-amount="entry.amount" :absolute="false" />
        {{ entry.mosaicHex }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {TransferTs} from './TransferTs'
export default class TransactionDetailsTransfer extends TransferTs {}
</script>

<style lang="less" scoped>
.transaction-details-container {
  position: relative;
  font-size: 20px;

  .details-row {
    padding-top: 10px;

    .value {
      font-weight: bolder;
    }
  }
}  
</style>
