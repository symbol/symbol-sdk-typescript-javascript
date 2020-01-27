<template>
  <span>
    <span>{{ parts[0] }}</span>
    <span class="lighter-color">{{ parts[1] === 0 ? '0' : parts[1].toString().replace(/^0\./, '').toFixed(decimals) }}</span>
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
