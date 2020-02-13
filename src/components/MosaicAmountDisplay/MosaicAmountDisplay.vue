<template>
  <span :class="[ 'amount', 'overflow_ellipsis', color ]">
    <AmountDisplay :value="amount" :decimals="divisibility" :size="size" />
  </span>
</template>

<script lang="ts">
import {MosaicAmountDisplayTs} from './MosaicAmountDisplayTs'
import './MosaicAmountDisplay.less'

export default class MosaicAmountDisplay extends MosaicAmountDisplayTs {}
</script>
