<template>
  <div class="monitor_panel_container">
    <div ref="monitorPanelLeftContainer" class="monitor_panel_left_container">
      <AccountBalancesPanel />
    </div>

    <div class="monitor_panel_right_container">
      <NetworkStatisticsPanel />
      <RouterTabList :tab-entries="tabEntries" />

      <div class="radius bottom_router_view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {DashboardTs} from '@/views/dashboard/DashboardTs.ts'
import "./Dashboard.less";

export default class Dashboard extends DashboardTs {

}
</script>
