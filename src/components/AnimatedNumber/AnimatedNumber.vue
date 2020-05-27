<template>
  <div class="number-grow-warp">
    <number ref="animee" :from="0" :to="value" :duration="4" easing="Power1.easeOut" />
  </div>
</template>

<script lang="ts">
import { AnimatedNumberTs } from './AnimatedNumberTs'
export default class AnimatedNumber extends AnimatedNumberTs {}
</script>
<style lang="less" scoped>
@import './AnimatedNumber.less';
</style>
