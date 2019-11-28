<template>
  <div class="step-2-wrapper" @mouseover="isSlidable && handleMousemove($event)">
    <img src="@/common/img/back.png"/>
    <div class="progress-bar">
      {{$t('Move_your_mouse')}}
    </div>
    <Progress :stroke-width="20" stroke-color="#1FB6AC" :percent="percent"/>
  </div>
</template>

<script lang="ts">
    import GenerateMnemonicTs from "./GenerateMnemonicTs"
    import "./GenerateMnemonic.less"
    export default class GenerateMnemonic extends GenerateMnemonicTs {
    }
</script>

<style scoped >
</style>
