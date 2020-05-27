<template>
  <div class="dashboard-container">
    <ProfileBalancesPanel />
    <div class="dashboard-right-outer-container">
      <div class="dashboard-right-container">
        <NetworkStatisticsPanel />
        <div class="right-bottom-container xym-outline">
          <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
          <div class="radius bottom_router_view">
            <router-view />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { DashboardTs } from './DashboardTs'
export default class Dashboard extends DashboardTs {}
</script>
<style lang="less" scoped>
@import './Dashboard.less';
</style>
