<template>
  <div class="dash_board_container secondary_page_animate">
    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_7_days')}}</span>
        <span class="right">
          <span>{{$t('The_total_market_capitalization')}} (USD)</span>
          <span class="black">{{formatNumber(xemUsdPrice)}}</span>
        </span>
        <div>
          <span class="right">
              <span>{{$t('average_price')}}</span><span class="black">${{averagePrice}} </span>
            <span>{{$t('yesterday')}}</span><span :class="riseRange < 0 ? 'red':'green'">{{riseRange}}%</span>
          </span>
        </div>
        <LineChart />
      </div>
      <div class="right_net_status radius">
        <div class="panel_name">{{$t('network_status')}}</div>

        <div
          class="network_item radius"
          v-for="(n, index) in networkStatusList"
          :key="index"
        >
          <img :src="n.icon">
          <span :class="['descript',index==1? 'long':'']">{{$t(n.descript)}}</span>
          <span :class="['data','overflow_ellipsis', updateAnimation]">
            <numberGrow v-if="index !== 4" :value="chainStatus[n.variable]"></numberGrow>
            <span v-else>****{{chainStatus[n.variable].substr(-4,4)}}</span>
          </span>
        </div>
      </div>
    </div>
    <div class="transaction-list-wrapper">
       <TransactionList />
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
