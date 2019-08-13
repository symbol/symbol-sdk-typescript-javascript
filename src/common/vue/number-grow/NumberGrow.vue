<template>
  <div class="number-grow-warp">
    <span v-if="isAdd" ref="numberGrow" :data-time="time" class="number-grow" :data-value="value?value:0"></span>
    <span v-else="isAdd">{{numValue}}</span>
  </div>
</template>

<script lang="ts">
    import {NumberGrowTs} from './NumberGrowTs'

    export default class NumberGrow extends NumberGrowTs {

    }
</script>

<style>
  @import "NumberGrow.less";
</style>
