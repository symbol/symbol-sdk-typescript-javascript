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
import {MosaicDefinitionTs} from './MosaicDefinitionTs'
export default class TransactionDetailsMosaicDefinition extends MosaicDefinitionTs {}
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
