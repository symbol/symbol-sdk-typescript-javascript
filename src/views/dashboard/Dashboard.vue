<template>
  <div class="dashboard-container">
    <div class="dashboard-left-container xym-outline">
      <AccountBalancesPanel />
    </div>

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
</template>

<script lang="ts">
// @ts-ignore
import {DashboardTs} from '@/views/dashboard/DashboardTs.ts'
import './Dashboard.less'

export default class Dashboard extends DashboardTs {}
</script>
