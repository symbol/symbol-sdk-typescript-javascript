<template>
  <span class="amount-display-container">
    <span class="integer-part">{{ integerPart }}</span>
    <span class="fractional-part">{{ fractionalPart }}</span>
    <span v-if="showTicker" class="ticker">&nbsp;{{ networkMosaicTicker }}</span>
  </span>
</template>

<script lang="ts">
import {AmountDisplayTs} from './AmountDisplayTs'

export default class AmountDisplay extends AmountDisplayTs {}
</script>

<style scoped lang="less">
.amount-display-container {
  span {
    font-size: 20px;
  }
  .integer-part {
    opacity: 1;
  }
  .fractional-part {
    opacity: .4;
  }
}
</style>
