<template>
  <div class="spinner">
    <div class="bounce1" />
    <div class="bounce2" />
    <div class="bounce3" />
  </div>
</template>

<script lang="ts">
import {Component, Vue} from 'vue-property-decorator'
@Component
export default class ThreeDotsLoading extends Vue { }
</script>
<style scoped lang="less">
  @import "ThreeDotsLoading";
</style>
