<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
      <div class="top_wallet_address radius">
        <div class="wallet_address">
          <span class="address">
            {{address}}
          </span>
          <img class="pointer" @click="copyAddress"
               src="@/common/img/monitor/monitorCopyAddress.png" alt="">
        </div>

        <div class="split"></div>
        <div class="XEM_amount"><span>XEM</span><span class="amount">{{formatXEMamount(XEMamount + '')}}</span>
        </div>
        <div class="exchange">${{(XEMamount*currentPrice).toFixed(2)}}</div>

        <div class="account_alias" v-show="isShowAccountAlias">
          {{$t('alias')}}：wallet.name
        </div>
      </div>
      <div class="bottom_account_info radius" ref="bottomAccountInfo">
        <div v-if="isShowAccountInfo" class="mosaicListWrap">
          <Spin v-if="isLoadingMosaic" size="large" fix class="absolute"></Spin>
          <Tabs size="small" v-if="!isShowManageMosaicIcon">
            <TabPane :label="$t('assets')" name="name1">
              <img @click="manageMosaicList()" class="asset_list pointer"
                   src="@/common/img/monitor/monitorAssetList.png">
              <!--        all       -->
              <div class="mosaicList">
                <div class="mosaic_data" v-if="value.show" v-for="(value,key,index) in mosaicMap"
                     :key="index">
                <span class="img_container">
                    <img v-if="index == 0" src="@/common/img/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="@/common/img/monitor/mosaicDefault.png" alt="">
                </span>
                  <span class="mosaic_name">{{value.name?value.name:key}}</span>
                  <span class="mosaic_value">
                  <div>{{value.amount.lower?value.amount.compact():value.amount}}</div>
                </span>
                </div>
                <div class="mosaic_data"></div>
              </div>
            </TabPane>
          </Tabs>

          <!--        sevral      -->
          <div v-if="isShowManageMosaicIcon" class="searchMosaic">
            <div class="asset_setting_tit pointer" @click="showMosaicMap">
              <img src="@/common/img/monitor/monitorLeftArrow.png" alt="">
              <span>{{$t('asset_setting')}}</span>
            </div>
            <div class="input_outter">
              <img src="@/common/img/monitor/monitorSearchIcon.png" alt="">
              <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
              <span class="search pointer" @click="searchMosaic">{{$t('search')}}</span>

            </div>
            <div class="mosaicList">
              <div class="mosaic_data" v-if="value.showInManage" v-for="(value,key,index) in mosaicMap" :key="index">
                <span class="namege_img">
                    <img @click="toggleShowMosaic(key,value)" class="small_icon pointer"
                         :src="value.show?monitorSeleted:monitorUnselected">
                    <img v-if="index == 0" class="mosaicIcon"
                         src="@/common/img/monitor/monitorMosaicIcon.png">
                    <img v-else class="mosaicIcon" src="@/common/img/monitor/mosaicDefault.png">
                </span>
                <span class="mosaic_name">{{value.name?value.name:key}}</span>
                <span class="mosaic_value">
                  <div>{{value.amount}}</div>
                </span>
              </div>
              <div class="complete_container">
                <div class="complete" @click="showMosaicMap">{{$t('complete')}}</div>
              </div>
              <div class="mosaic_data"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="monitor_panel_right_container">
      <div class="top_navidator radius">
        <span :class="[n.isSelect?'active_navigator':'','outter_container',n.disabled?'disabled':'pointer']"
              @click="switchPanel(index)"
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
    import {MonitorPanelTs} from './MonitorPanelTs'

    export default class MonitorPanel extends MonitorPanelTs {

    }
</script>

<style scoped lang="less">
  @import "MonitorPanel.less";
</style>
