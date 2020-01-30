<template>
  <span>
    <span>{{ parts[0] }}</span>
    <span class="lighter-color">{{ parts[1] === 0 ? '' : parts[1].toFixed(decimals).replace(/^0/, '') }}</span>
  </span>
</template>

<script lang="ts">
import {AmountDisplayTs} from './AmountDisplayTs'

export default class AmountDisplay extends AmountDisplayTs {}
</script>

<style scoped lang="less">
  .lighter-color {
    opacity: .4;
  }
</style>
