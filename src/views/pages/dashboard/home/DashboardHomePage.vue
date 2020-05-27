<template>
  <div class="monitor-dashboard-wrapper secondary_page_animate">
    <div class="transaction-list-wrapper">
      <TransactionList v-if="!!accountAddress" :address="accountAddress" />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { DashboardHomePageTs } from './DashboardHomePageTs'
export default class DashboardHomePage extends DashboardHomePageTs {}
</script>
<style lang="less" scoped>
@import './DashboardHomePage.less';
</style>
