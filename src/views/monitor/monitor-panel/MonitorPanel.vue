<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
      <div class="top_wallet_balance radius">
        <div class="wallet_balance">钱包余额</div>
        <div class="split"></div>
        <div class="XEM_amount"><span>XEM</span><span class="amount">166.000.000000</span></div>
        <div class="exchange">￥ 63.911.64</div>
      </div>
      <div class="bottom_account_info radius" ref="bottomAccountInfo">
        <div v-if="isShowAccountInfo">

          <Tabs size="small">
            <TabPane label="马赛克" name="name1">
              <img @click="manageMosaicList()" class="asset_list"
                   src="../../../assets/images/monitor/monitorAssetList.png">
              <div class="mosaic_data" v-for="(m,index) in mosaicList">
                <span>
                    <img @click="deleteMosaic(index)" v-if="isShowManageMosaicIcon" class="small_icon"
                         src="../../../assets/images/monitor/monitorDelMosaic.png" alt="">
                    <img src="../../../assets/images/monitor/monitorMosaicIcon.png" alt="">
                </span>

                <span class="mosaic_name">{{m.name}}</span>
                <span class="mosaic_value">
                  <div>{{m.amount}}</div>
                  <div>{{m.rate}}</div>
                </span>
              </div>
            </TabPane>
            <TabPane label="命名空间" name="name2">
              <div class="namespace_data">
                <div class="namespace_table_head">
                  <span class="namespace">命名空间</span>
                  <span class="duration">有效期</span>
                </div>
                <div class="namespace_item" v-for="i in 3">
                  <span class="namespace">@123.456</span>
                  <span class="duration">2019-02-09</span>
                </div>
              </div>
            </TabPane>
            <TabPane label="收获的块" name="name3">
              <div class="harvesting_data">
                <div class="harvesting_item " v-for="i in 3">
                  <div class="clear top_info">
                    <span class="left">块：4585464</span>
                    <span class="right">fees:1.0546551xem</span>
                  </div>
                  <div class="bottom_info">
                    <span class="left">include: 1 txs</span>
                    <span class="right">2019-07-09 16:00</span>
                  </div>
                </div>
              </div>
            </TabPane>
          </Tabs>
        </div>
      </div>
    </div>
    <div class="monitor_panel_right_container">
      <div class="top_navidator radius">
        <span :class="[n.isSelect?'active_navigator':'','pointer','outter_container']" @click="switchPanel(index)" v-for="(n,index) in navigatorList">
          <span class="inner_container absolute">{{n.name}}</span>
          <span class="line">|</span>
        </span>
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
        mosaicList = [
            {
                name: 'XEM',
                amount: 0.265874,
                rate: 30.55
            },
            {
                name: 'ETC',
                amount: 0.265874,
                rate: 30.55
            },
            {
                name: 'ETH',
                amount: 0.265874,
                rate: 30.55
            },
            {
                name: 'BTC',
                amount: 0.265874,
                rate: 30.55
            }
        ]
        isShowAccountInfo = true;
        isShowManageMosaicIcon = false

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

        hideAssetInfo() {
            this.isShowAccountInfo = false;
        }

        manageMosaicList() {
            this.isShowManageMosaicIcon = !this.isShowManageMosaicIcon
        }

        deleteMosaic(index) {
            this.mosaicList.splice(index, 1)
        }
        bottomAccountInfo
        onResize () {
            const height = this.$refs['monitorPanelLeftContainer']['clientHeight'] - ( this.$refs['bottomAccountInfo']['offsetTop'] - this.$refs['monitorPanelLeftContainer']['offsetTop'])
            this.$refs['bottomAccountInfo']['style']['height'] = height + 5 +'px'
            console.log(height)
        }
        mounted() {
            const that = this
            window.addEventListener('resize',function () {
                if(that.$refs['bottomAccountInfo']){
                    that.onResize()
                }
            })
            that.onResize()
        }

        created() {
            this.$router.push({
                name: 'dashBoard'
            })
        }
    }
</script>

<style scoped lang="less">
  @import "MonitorPanel.less";
</style>
