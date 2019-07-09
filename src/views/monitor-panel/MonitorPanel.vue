<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container">
      <div class="top_wallet_balance radius">
        <div class="wallet_balance">钱包余额</div>
        <div class="split"></div>
        <div class="XEM_amount"><span>XEM</span><span class="amount">166.000.000000</span></div>
        <div class="exchange">￥ 63.911.64</div>
      </div>

      <div class="bottom_account_info radius">
        <div class="account_info_navigator">
          <span :class="a.isSelect? 'active_navigator':''" @click="swichInfoPanel(index)" v-for="(a,index) in accountInfoNavigatorList">{{a.name}}</span>
        </div>
        <div class="mosaic_info" v-show="accountInfoNavigatorList[0].isSelect">
          马赛克。。。
        </div>
        <div class="namespace" v-show="accountInfoNavigatorList[1].isSelect">
          命名空间。。。
        </div>
        <div class="havesting" v-show="accountInfoNavigatorList[2].isSelect">
          收获的块。。。
        </div>
      </div>
    </div>

    <div class="monitor_panel_right_container">
      <div class="top_navidator radius">
        <span :class="n.isSelect?'active_navigator':''" @click="switchPanel(index)" v-for="(n,index) in navigatorList">{{n.name}}</span>
      </div>
      <div class="bottom_router_view">
        <router-view/>
      </div>
      <div class="transaction_status radius">

      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class DashBoard extends Vue {

        navigatorList: any = [
            {
                name: '仪表盘',
                isSelect: true,
                path: 'dashBoard'
            }, {
                name: '市场',
                isSelect: false,
                path: 'market'
            }, {
                name: '转账',
                isSelect: false,
                path: 'transfer'
            }, {
                name: '收据',
                isSelect: false,
                path: 'receipt'
            }, {
                name: '委托收益',
                isSelect: false,
                path: 'remote'
            }]
        accountInfoNavigatorList: any = [
            {
                name: '马赛克',
                isSelect: true,
            }, {
                name: '命名空间',
                isSelect: false,
            },{
                name: '收获的块',
                isSelect: false,
            },
        ]

        switchPanel(index) {
            const list = this.navigatorList.map((item) => {
                item.isSelect = false
                return item
            });
            list[index].isSelect = true
            this.navigatorList = list
            this.$router.push({
                name: list[index].path
            })
        }

        swichInfoPanel(index) {
            const list = this.accountInfoNavigatorList.map((item) => {
                item.isSelect = false
                return item
            });
            list[index].isSelect = true
            this.accountInfoNavigatorList = list
        }
        created() {
            this.$router.push({
                name:'dashBoard'
            })
        }
    }
</script>

<style scoped lang="less">
  @import "./MonitorPanel.less";
</style>
