<template>
  <div class="monitor-dashboard-wrapper radius secondary_page_animate">
    <div class="top_network_info">
      <div class="top_wallet_info">
        <div class="netWork radius">
          <div class="title">
            <span class="title_txt">{{$t('nodes')}}</span>
          </div>
          <img src="@/common/img/monitor/network.png" alt/>
          <span class="txt_info"><numberGrow :value="chainStatus.nodeNumber"></numberGrow></span>
        </div>
        <div class="block_height radius">
          <div class="title">
            <span class="title_txt">{{$t('blocks')}}</span>
          </div>
          <img src="@/common/img/monitor/block_height.png" alt/>
          <span class="txt_info">
            <numberGrow :value="currentHeight"></numberGrow>
          </span>
        </div>
        <div class="amount radius">
          <div class="title">
            <span class="title_txt">{{$t('transactions')}}</span>
          </div>
          <img src="@/common/img/monitor/amount.png" alt/>
          <span class="txt_info">
            <numberGrow :value="chainStatus.numTransactions"></numberGrow>
          </span>
        </div>
        <div class="block_time radius">
          <div class="title">
            <span class="title_txt">{{$t('time')}}</span>
            <span>
              <numberGrow :value="chainStatus.targetBlockTime"></numberGrow>
            </span>
          </div>
          <span class="txt_info">{{$t('recent_block')}}：</span>
          <span class="txt_info2">
            {{chainStatus.getTimeFromBlockNumber(chainStatus.currentHeight)}}
          </span>
        </div>
      </div>
    </div>
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
