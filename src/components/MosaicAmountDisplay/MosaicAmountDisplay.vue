<template>
  <span :class="['amount', 'overflow_ellipsis', color]">
    <AmountDisplay :value="amount" :decimals="divisibility" :size="size" :show-ticker="showTicker" :ticker="ticker" />
  </span>
</template>

<script lang="ts">
import { MosaicAmountDisplayTs } from './MosaicAmountDisplayTs'
export default class MosaicAmountDisplay extends MosaicAmountDisplayTs {}
</script>
<style lang="less" scoped>
@import './MosaicAmountDisplay.less';
</style>
