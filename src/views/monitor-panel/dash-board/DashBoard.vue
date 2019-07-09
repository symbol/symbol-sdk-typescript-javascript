<template>
  <div class="dash_board_container">
    <div class="top_network_info">
      <div class="left_echart radius">

      </div>
      <div class="right_net_status radius">
        <div class="panel_name">网络状态</div>
        <div class="network_item radius" v-for="n in networkStatusList">
          <img src="../../../assets/images/window/windowNetworkItem.png" alt="">
          <span class="descript">{{n.descript}}</span>
          <span class="data">{{n.data}}</span>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius">
      <Tabs value="name1">
        <TabPane :label="confirmedTxTit" name="name1">
          <div class="confirmed_transactions">
            <div class="table_head">
              <span class="account">账户</span>
              <span class="transfer_type">交易类型</span>
              <span class="amount">量</span>
              <span class="date">日期</span>
            </div>
            <div class="table_body hide_scroll">
              <div class="table_item" v-for="i in 7">
                <img src="" alt="">
                <span class="account">fsf-fsf-sdfdsf-fdsf-sdfsdgdfgdfgs-dgsdgdf</span>
                <span class="transfer_type">收款</span>
                <span class="amount">+454.511xem</span>
                <span class="date">2019-09-09 16:13:15</span>
              </div>
            </div>
          </div>

        </TabPane>


        <TabPane :label="unConfirmedTxTit" name="name2">标签二的内容</TabPane>
      </Tabs>
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

        confirmedTxTit = (h) => {
            return h('div', [
                h('span', '已确认事务'),
                h('Badge', {
                    props: {
                        count: 3
                    }
                })
            ])
        }
        unConfirmedTxTit = (h) => {
            return h('div', [
                h('span', '未确认事务'),
                h('Badge', {
                    props: {
                        count: 3
                    }
                })
            ])
        }

    }
</script>

<style scoped lang="less">
  @import "./DashBoard.less";
</style>
