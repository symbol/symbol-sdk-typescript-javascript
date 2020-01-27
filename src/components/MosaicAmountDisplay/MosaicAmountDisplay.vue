<template>
  <span :class="[ 'overflow_ellipsis', color ]">
    <AmountDisplay :amount="amount" :decimals="divisibility" />
  </span>
</template>

<script lang="ts">
import {MosaicAmountDisplayTs} from './MosaicAmountDisplayTs'
import './MosaicAmountDisplay.less'

export default class MosaicAmountDisplay extends MosaicAmountDisplayTs {}
</script>
