<template>
  <div class="dash_board_container">
    <div class="top_network_info">
      <div class="left_echart radius">

      </div>
      <div class="right_net_status radius">
        <div class="panel_name">网络状态</div>
        <div class="network_item radius" v-for="n in networkStatusList">
          <img src="../../../assets/images/window/window_network_item.png" alt="">
          <span class="descript">{{n.descript}}</span>
          <span class="data">{{n.data}}</span>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius">
      <div class="transaction_navigator left">
        <div>已确认事务</div>
        <div>未确认事务</div>
      </div>
      <div class="page_split right"></div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class DashBoard extends Vue {
        networkStatusList = [
            {
                icon: '',
                descript: '块高',
                data: 1978365,
            }, {
                icon: '',
                descript: '平均产块时间',
                data: 12,
            }, {
                icon: '',
                descript: '节点',
                data: 1,
            }, {
                icon: '',
                descript: '交易数',
                data: 0,
            }
        ]

    }
</script>

<style scoped lang="less">
  @import "./DashBoard.less";
</style>
