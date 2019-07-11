<template>
  <div class="dash_board_container">
      <Modal
              title="事务详情"
              v-model="isShowDialog"
              class-name="dash_board_dialog">
        <div class="transfer_type" >
          <span class="title">{{transactionDetails[0].key}}</span>
          <span class="value" >{{transactionDetails[0].value}}</span>
        </div>
        <div>
          <div v-for="t in transactionDetails" class="other_info">
            <span class="title">{{t.key}}</span>
            <span class="value" >{{t.value}}</span>
          </div>
        </div>
      </Modal>

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">XEM行情走势（近7天）</span>
        <span class="right">
          <span >总市值（CNY）</span>
          <span class="black">836,341,288.11</span>

        </span>
        <LineChart></LineChart>
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
      <Page class="splite_page" :total="100" show-total/>
      <Tabs size="small">
        <TabPane :label="confirmedTxTit" name="name1">
          <div class="confirmed_transactions">
            <div class="table_head">
              <span class="account">账户</span>
              <span class="transfer_type">交易类型</span>
              <span class="amount">量</span>
              <span class="date">日期</span>
            </div>
            <div class="table_body hide_scroll">
              <div class="table_item" @click="showDialog" v-for="i in 7">
                <img class="mosaic_action" src="../../../assets/images/monitor/dash-board/dashboardMosaicIn.png" alt="">
                <span class="account">fsf-fsf-sdfdsf-fdsf-sdfsdgdfgdfgs-dgsdgdf</span>
                <span class="transfer_type">收款</span>
                <span class="amount">+454.511xem</span>
                <span class="date">2019-09-09 16:13:15</span>
                <img src="../../../assets/images/monitor/dash-board/dashboardExpand.png"
                     class="radius expand_mosaic_info" alt="">
              </div>
            </div>
          </div>
        </TabPane>


        <TabPane :label="unConfirmedTxTit" name="name2">
          <div class="confirmed_transactions">
            <div class="table_head">
              <span class="account">账户</span>
              <span class="transfer_type">交易类型</span>
              <span class="amount">量</span>
              <span class="date">日期</span>
            </div>
            <div class="table_body hide_scroll">
              <div class="table_item" @click="showDialog" v-for="i in 7">
                <img class="mosaic_action" src="../../../assets/images/monitor/dash-board/dashboardMosaicIn.png" alt="">
                <span class="account">fsf-fsf-sdfdsf-fdsf-sdfsdgdfgdfgs-dgsdgdf</span>
                <span class="transfer_type">收款</span>
                <span class="amount">+454.511xem</span>
                <span class="date">2019-09-09 16:13:15</span>
                <img src="../../../assets/images/monitor/dash-board/dashboardExpand.png"
                     class="radius expand_mosaic_info" alt="">
              </div>
            </div>
          </div>
        </TabPane>
      </Tabs>

    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import LineChart from '@/components/LineChart.vue'

    @Component({
        components: {
            LineChart
        }
    })
    export default class DashBoard extends Vue {
        isShowDialog = false
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
        transactionDetails = [
            {
                key:'转账类型',
                value:'收款'
            },
            {
                key:'来自',
                value:'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                key:'目标',
                value:'Test wallet'
            },
            {
                key:'量',
                value:'10.000000XEM'
            },
            {
                key:'费用',
                value:'0.050000000XEM'
            },
            {
                key:'块',
                value:'1951249'
            },
            {
                key:'hash',
                value:'9BBCAECDD5E2D04317DE9873DC99255A9F8A33FA5BB570D1353F65CB31A44151'
            },
            {
                key:'消息',
                value:'message'
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
        showDialog() {
            this.isShowDialog = true
            console.log('...........')
        }


    }
</script>

<style scoped lang="less">
  @import "MonitorDashBoard.less";
</style>
