<template>
  <div class="dash_board_container">
    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="transfer_type">
        <span class="title">{{$t(transactionDetails[0].key)}}</span>
        <span class="value">{{$t(transactionDetails[0].value)}}</span>
      </div>
      <div>
        <div v-if="index !== 0" v-for="(t,index) in transactionDetails" class="other_info">
          <span class="title" >{{$t(t.key)}}</span>
          <span class="value">{{t.value}}</span>
        </div>
      </div>
    </Modal>

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_7_days')}}</span>
        <span class="right">
          <span>{{$t('The_total_market_capitalization')}}（CNY）</span>
          <span class="black">{{currentPrice}}</span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_status radius">
        <div class="panel_name">{{$t('network_status')}}</div>
        <div class="network_item radius" v-for="n in networkStatusList">
          <img :src="n.icon" alt="">
          <span class="descript">{{$t(n.descript)}}</span>
          <span class="data">{{n.data}}</span>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius scroll" ref="bottomTransactions">
      <div  class="splite_page">
        <span>{{$t('total')}}：100 {{$t('data')}}</span>
        <Page :total="100" class="page_content" />
      </div>


      <div class="label_page">
        <span @click="showConfirmedTransactions=true" :class="[showConfirmedTransactions?'selected':'','page_title']">{{$t('confirmed_transaction')}}
          <span class="transacrion_num">3</span>
        </span>
        <span class="line">|</span>
        <span @click="showConfirmedTransactions=false" :class="[showConfirmedTransactions?'':'selected','page_title']">{{$t('unconfirmed_transaction')}}
          <span class="transacrion_num">3</span>
        </span>
      </div>

      <div class="all_transaction">
        <div class="table_head">
          <span class="account">{{$t('account')}}</span>
          <span class="transfer_type">{{$t('transaction_type')}}</span>
          <span class="amount">{{$t('the_amount')}}</span>
          <span class="date">{{$t('date')}}</span>
        </div>
        <div class="confirmed_transactions" v-if="showConfirmedTransactions">

          <div class="table_body hide_scroll" ref="confirmedTableBody">
            <div class="table_item pointer" @click="showDialog" v-for="i in 7">
              <img class="mosaic_action" src="../../../assets/images/monitor/dash-board/dashboardMosaicIn.png" alt="">
              <span class="account">fsf-fsf-sdfdsf-fdsf-sdfsdgdfgdfgs-dgsdgdf</span>
              <span class="transfer_type">{{$t('payment')}}</span>
              <span class="amount">+454.511xem</span>
              <span class="date">2019-09-09 16:13:15</span>
              <img src="../../../assets/images/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info" alt="">
            </div>
          </div>
        </div>

        <div class="unconfirmed_transactions" v-if="!showConfirmedTransactions">

          <div class="table_body hide_scroll" ref="unconfirmedTableBody">
            <div class="table_item pointer" @click="showDialog" v-for="i in 7">
              <img class="mosaic_action" src="../../../assets/images/monitor/dash-board/dashboardMosaicIn.png" alt="">
              <span class="account">fsf-fsf-sdfdsf-fdsf-sdfsdgdfgdfgs-dgsdgdf</span>
              <span class="transfer_type">{{$t('gathering')}}</span>
              <span class="amount">+454.511xem</span>
              <span class="date">2019-09-09 16:13:15</span>
              <img src="../../../assets/images/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info" alt="">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import LineChart from '@/components/LineChart.vue'
    import axios from 'axios'
    import {formatNumber} from '../../../utils/tools.js'
    import {blockchainInterface} from '../../../interface/sdkBlockchain'
    import dashboardBlockHeight from '../../../assets/images/monitor/dash-board/dashboardBlockHeight.png'
    import dashboardBlockTime from '../../../assets/images/monitor/dash-board/dashboardBlockTime.png'
    import dashboardPointAmount from '../../../assets/images/monitor/dash-board/dashboardPointAmount.png'
    import dashboardTransactionAmount from '../../../assets/images/monitor/dash-board/dashboardTransactionAmount.png'

    @Component({
        components: {
            LineChart
        }
    })
    export default class DashBoard extends Vue {
        isShowDialog = false
        xemNum: number = 8999999999
        currentPrice: any = 0
        networkStatusList = [
            {
                icon: dashboardBlockHeight,
                descript: 'block_height',
                data: 1978365,

            }, {
                icon: dashboardBlockTime,
                descript: 'average_block_time',
                data: 12,
            }, {
                icon: dashboardPointAmount,
                descript: 'point',
                data: 4,
            }, {
                icon: dashboardTransactionAmount,
                descript: 'number_of_transactions',
                data: 0,
            }
        ]
        showConfirmedTransactions = false
        transactionDetails = [
            {
                key: 'transfer_type',
                value: 'gathering'
            },
            {
                key: 'from',
                value: 'TCTEXC-5TGXD7-OQCHBB-MNU3LS-2GFCB4-2KD75D-5VCN'
            },
            {
                key: 'aims',
                value: 'Test wallet'
            },
            {
                key: 'the_amount',
                value: '10.000000XEM'
            },
            {
                key: 'fee',
                value: '0.050000000XEM'
            },
            {
                key: 'block',
                value: '1951249'
            },
            {
                key: 'hash',
                value: '9BBCAECDD5E2D04317DE9873DC99255A9F8A33FA5BB570D1353F65CB31A44151'
            },
            {
                key: 'message',
                value: 'message test this'
            }
        ]

        showDialog() {
            this.isShowDialog = true
        }

        async getMarketOpenPrice() {
            const that = this
            const url = this.$store.state.app.marketUrl + '/kline/xemusdt/1min/1'
            await axios.get(url).then(function (response) {
                const result = response.data.data[0]
                that.currentPrice = result.open * that.xemNum
            }).catch(function (error) {
                console.log(error);
            });
        }

        getPointInfo() {
            const that = this
            const node = this.$store.state.account.node
            blockchainInterface.getBlockchainHeight({
                node
            }).then((result) => {
                result.result.blockchainHeight.subscribe((res) => {
                    const height = Number.parseInt(res.toHex(), 16)
                    that.networkStatusList[0].data = height
                    blockchainInterface.getBlockByHeight({
                        node,
                        height: height
                    }).then((blockInfo) => {
                        blockInfo.result.Block.subscribe((block) => {
                            that.networkStatusList[3].data = block.numTransactions
                        })
                    })
                })
            })
        }

        created() {
            this.getMarketOpenPrice()
            this.getPointInfo()
        }
    }
</script>

<style scoped lang="less">
  @import "MonitorDashBoard.less";
</style>
