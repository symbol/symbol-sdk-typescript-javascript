<template>
  <div class="number-grow-warp">
    <span
      v-if="value > 0" ref="animee" :data-time="time"
      class="number-grow" :data-value="value"
    />
    <span v-else>{{ formatters.formatNumber(value) || 0 }}</span>
  </div>
</template>

<script lang="ts">
import {AnimatedNumberTs} from '@/components/AnimatedNumber/AnimatedNumberTs.ts'
import "./AnimatedNumber.less";

export default class AnimatedNumber extends AnimatedNumberTs {}
</script>
