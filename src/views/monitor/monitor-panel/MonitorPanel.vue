<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
      <div class="top_wallet_balance radius">
        <div class="wallet_balance">{{$t('wallet_balance')}}</div>
        <div class="split"></div>
        <div class="XEM_amount"><span>XEM</span><span class="amount">166.000.000000</span></div>
        <div class="exchange">￥ 63.911.64</div>
      </div>
      <div class="bottom_account_info radius" ref="bottomAccountInfo">
        <div v-if="isShowAccountInfo">

          <Tabs size="small" v-if="!isShowManageMosaicIcon">
            <TabPane :label="$t('mosaic')" name="name1">
              <img @click="manageMosaicList()" class="asset_list"
                   src="../../../assets/images/monitor/monitorAssetList.png">
              <!--        all       -->
              <div>
                <div class="mosaic_data" v-if="m.show" v-for="(m,index) in mosaicList">
                <span>
                    <img src="../../../assets/images/monitor/monitorMosaicIcon.png" alt="">
                </span>
                  <span class="mosaic_name">{{m.name}}</span>
                  <span class="mosaic_value">
                  <div>{{m.amount}}</div>
                  <div>￥{{m.rate}}</div>
                </span>
                </div>
              </div>
            </TabPane>
            <TabPane :label="$t('namespace')" name="name2">
              <div class="namespace_data">
                <div class="namespace_table_head">
                  <span class="namespace">{{$t('namespace')}}</span>
                  <span class="duration">{{$t('validity_period')}}</span>
                </div>
                <div class="namespace_item" v-for="i in 3">
                  <span class="namespace">@123.456</span>
                  <span class="duration">2019-02-09</span>
                </div>
              </div>
            </TabPane>
            <TabPane :label="$t('harvested_block')" name="name3">
              <div class="harvesting_data">
                <div class="harvesting_item " v-for="i in 3">
                  <div class="clear top_info">
                    <span class="left">{{$t('block')}}：4585464</span>
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

          <!--        sevral      -->
          <div v-if="isShowManageMosaicIcon">
            <div class="asset_setting_tit" @click="isShowManageMosaicIcon = !isShowManageMosaicIcon">
              <img src="../../../assets/images/monitor/monitorLeftArrow.png" alt="">
              <span>{{$t('asset_setting')}}</span>
            </div>
            <div class="input_outter">
              <img src="../../../assets/images/monitor/monitorSearchIcon.png" alt="">
              <input type="text" :placeholder="$t('search_for_asset_name')">
            </div>
            <div class="mosaic_data" v-for="(m,index) in mosaicList">
                <span>
                    <img @click="m.show=!m.show" class="small_icon"
                         :src="m.show?monitorSeleted:monitorUnselected">
                    <img src="../../../assets/images/monitor/monitorMosaicIcon.png">
                </span>
              <span class="mosaic_name">{{m.name}}</span>
              <span class="mosaic_value">
                  <div>{{m.amount}}</div>
                  <div>￥{{m.rate}}</div>
                </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="monitor_panel_right_container">
      <div class="top_navidator radius">
        <span :class="[n.isSelect?'active_navigator':'','pointer','outter_container']" @click="switchPanel(index)"
              v-for="(n,index) in navigatorList">
          <span class="inner_container absolute">{{$t(n.name)}}</span>
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
    import monitorSeleted from '../../../assets/images/monitor/monitorSeleted.png'
    import monitorUnselected from '../../../assets/images/monitor/monitorUnselected.png'

    @Component
    export default class DashBoard extends Vue {

        monitorUnselected = monitorUnselected
        monitorSeleted = monitorSeleted
        navigatorList: any = [
            {
                name: 'dash_board',
                isSelect: true,
                path: 'dashBoard'
            }, {
                name: 'market',
                isSelect: false,
                path: 'market'
            }, {
                name: 'transfer',
                isSelect: false,
                path: 'transfer'
            }, {
                name: 'receipt',
                isSelect: false,
                path: 'receipt'
            }, {
                name: 'remote',
                isSelect: false,
                path: 'remote'
            }]
        isShowAccountInfo = true;
        isShowManageMosaicIcon = false
        mosaicList = [{
            name: 'XEM',
            amount: 0.265874,
            rate: 30.55,
            show: true
        },
            {
                name: 'ETC',
                amount: 0.265874,
                rate: 30.55,
                show: true
            },
            {
                name: 'ETH',
                amount: 0.265874,
                rate: 30.55,
                show: true
            },
            {
                name: 'BTC',
                amount: 0.265874,
                rate: 30.55,
                show: true
            }]

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


    }
</script>

<style scoped lang="less">
  @import "MonitorPanel.less";
</style>
