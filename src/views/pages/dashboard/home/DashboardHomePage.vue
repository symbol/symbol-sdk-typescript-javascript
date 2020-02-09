<template>
  <div class="monitor-dashboard-wrapper secondary_page_animate">
    <div class="transaction-list-wrapper">
      <TransactionList v-if="!!currentWallet" :address="currentWallet.objects.address" />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {DashboardHomePageTs} from './DashboardHomePageTs'
import "./DashboardHomePage.less";

export default class DashboardHomePage extends DashboardHomePageTs {}
</script>
