<template>
  <div class="monitor-dashboard-wrapper secondary_page_animate">
    <div class="transaction-list-wrapper">
      <TransactionList/>
    </div>

  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MonitorDashBoardTs} from '@/views/monitor/monitor-dashboard/MonitorDashBoardTs.ts'
    export default class DashBoard extends MonitorDashBoardTs {
    }
</script>

<style scoped lang="less">
  @import "MonitorDashBoard.less";
</style>
