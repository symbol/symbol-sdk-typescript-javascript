<template>
  <div class="line_chart_container" @mouseout="mouseoutLine">
    <Spin size="large" class="absolute" fix v-if="spinShow"></Spin>
    <div class="line" id="id" ref="dom"></div>
  </div>

</template>

<script lang="ts">
    import {LineChartByDayTs} from './LineChartByDayTs'

    export default class LineChart extends LineChartByDayTs {
    }

</script>
<style scoped lang="less">
  @import "LineChartByDay.less";
</style>
