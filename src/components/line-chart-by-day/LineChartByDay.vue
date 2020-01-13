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
import {LineChartByDayTs} from '@/components/line-chart-by-day/LineChartByDayTs.ts'

export default class LineChart extends LineChartByDayTs {
}

</script>
<style scoped lang="less">
  @import "LineChartByDay.less";
</style>
