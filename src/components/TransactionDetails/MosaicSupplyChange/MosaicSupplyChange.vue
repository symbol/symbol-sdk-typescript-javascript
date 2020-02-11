<template>
  <div class="transaction-details-container">

    <div class="details-row">
      <div>
        Keys: {{ JSON.stringify(Array.from(view.values.keys())) }}
        Values: {{ JSON.stringify(Array.from(view.values.values())) }}
      </div>
    </div>

  </div>
</template>

<script lang="ts">
import {MosaicSupplyChangeTs} from './MosaicSupplyChangeTs'
export default class TransactionDetailsMosaicSupplyChange extends MosaicSupplyChangeTs {}
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
