<template>
  <div class="monitor_panel_container">
    <div ref="monitorPanelLeftContainer" class="monitor_panel_left_container">
      <AccountBalancesPanel />
    </div>

    <div class="monitor_panel_right_container">
      <NetworkStatisticsPanel />
      <RouterTabList :links="routes" />

      <div class="radius bottom_router_view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {MonitorTs} from '@/views/monitor/MonitorTs.ts'

export default class Monitor extends MonitorTs {

}
</script>

<style scoped lang="less">
  @import "Monitor.less";
</style>
