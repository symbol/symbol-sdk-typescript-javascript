<template>
  <span>
    <span>{{ integerPart }}</span>
    <span class="lighter-color">{{ fractionalPart }}</span>
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
