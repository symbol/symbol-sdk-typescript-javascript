<template>
  <div class="line_chart_container" @mouseout="mouseoutLine">
    <Spin
      v-if="spinShow" size="large" class="absolute"
      fix
    />
    <div id="id" ref="dom" class="line" />
  </div>
</template>

<script lang="ts">
import {LineChartTs} from '@/components/line-chart/LineChartTs.ts'

export default class LineChart extends LineChartTs {
}
</script>
<style scoped lang="less">
  @import "LineChart.less";
</style>
