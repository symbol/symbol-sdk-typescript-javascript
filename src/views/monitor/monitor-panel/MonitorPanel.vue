<template>
  <div class="monitor_panel_container">
    <div class="monitor_panel_left_container" ref="monitorPanelLeftContainer">
      <div class="top_wallet_address radius">
        <Spin v-if="balanceLoading" size="large" fix class="absolute"></Spin>
        <div class="wallet_address">
          <span class="address">
            {{address}}
          </span>
          <img class="pointer" @click="copyAddress"
               src="@/common/img/monitor/monitorCopyAddress.png" alt="">
        </div>

        <div class="split"></div>
        <div class="XEM_amount overflow_ellipsis">
          <span>XEM</span>
          <span class="amount">{{formatNumber(Number(formatXEMamount(XEMamount))?formatXEMamount(XEMamount + ''):0)}}</span>
        </div>
        <div class="exchange">${{formatNumber(XEMamount*xemUsdPrice?(XEMamount*xemUsdPrice).toFixed(2).toLocaleString():'0.00')}}</div>
        <!-- @TODO: Account Alias (update when method available) -->
        <!--<div class="account_alias" v-show="isShowAccountAlias">
          {{$t('alias')}}：wallet.name
        </div>-->
      </div>
      <div class="bottom_account_info radius" ref="bottomAccountInfo">
        <div v-if="isShowAccountInfo" class="mosaicListWrap">
          <Spin v-if="mosaicsLoading" size="large" fix class="absolute"></Spin>
          <Tabs size="small" v-if="!isShowManageMosaicIcon">
            <TabPane :label="$t('assets')" name="name1">
              <img @click="manageMosaicList()" class="asset_list pointer"
                   src="@/common/img/monitor/monitorAssetList.png">
              <!--        all       -->
              <div class="mosaicList secondary_page_animate">
                <div
                  class="mosaic_data"
                  v-for="(mosaic, index) in mosaicList"
                  :key="index"
                  v-if="mosaic.show"
                >
                  <span class="img_container">
                    <img v-if="index == 0" src="@/common/img/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="@/common/img/monitor/mosaicDefault.png" alt="">
                  </span>
                  <span class="mosaic_name">{{mosaic.name || mosaic.hex}}</span>
                  <span class="mosaic_value">
                    <div>{{formatNumber(mosaic.balance)}}</div>
                  </span>
                </div>
              </div>
            </TabPane>
          </Tabs>

          <!--        sevral      -->
          <div v-if="isShowManageMosaicIcon" class="searchMosaic secondary_page_animate">
            <!--            <div class="asset_setting_tit pointer" @click="showMosaicMap">-->

            <!--              <span>{{$t('asset_setting')}}</span>-->
            <!--            </div>-->
            <img src="@/common/img/monitor/monitorLeftArrow.png" @click="showMosaicMap" alt="">
            <div class="input_outter">

              <img src="@/common/img/monitor/monitorSearchIcon.png" alt="">
              <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
              <span class="search pointer" @click="searchMosaic">{{$t('search')}}</span>

            </div>
            <div class="mosaicList">
                <div class="toggle_all_checked ">
                  <span @click="toggleAllChecked()">
                    <div :class="['choose',  ischecked ? 'true' : 'false']"></div>
                    {{ !ischecked ? $t('select_all'):$t('all_unchecked')}}
                  </span>
                  <span @click="toggleShowExpired()">
                    <div :class="['choose',  showExpiredMosaics ? 'true' : 'false']"></div>
                    {{ showExpiredMosaics ? $t('Hide_expired_mosaic'):$t('Display_expired_mosaic')}}
                  </span>
                </div>
              <div
                  :class="['mosaic_data',index == 0?'padding_top_0':'']"
                  v-for="(mosaic, index) in filteredList"
                  :key="index"
                  class="mosaic_data"
                >
                <span class="namege_img">
                  <img @click="toggleShowMosaic(mosaic)" class="small_icon pointer"
                        :src="mosaic.show?monitorSeleted:monitorUnselected">
                  <img v-if="index == 0" class="mosaicIcon"
                        src="@/common/img/monitor/monitorMosaicIcon.png">
                  <img v-else class="mosaicIcon" src="@/common/img/monitor/mosaicDefault.png">
                </span>
                <span class="mosaic_name">{{mosaic.name || mosaic.hex}}</span>
                <span class="mosaic_value">
                  <div>{{mosaic.balance}}</div>
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
        <span
          :class="[n.isSelect?'active_navigator':'','outter_container',n.disabled?'disabled':'pointer']"
          @click="switchPanel(index)"
          v-for="(n,index) in navigatorList"
          :key="index"
        >
          <span class="inner_container absolute">{{$t(n.name)}}</span>
          <span class="line">|</span>
        </span>
      </div>
      <div class="bottom_router_view">
        <router-view/>
      </div>
      <div class="transaction_status radius" />
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MonitorPanelTs} from '@/views/monitor/monitor-panel/MonitorPanelTs.ts'

    export default class MonitorPanel extends MonitorPanelTs {

    }
</script>

<style scoped lang="less">
  @import "MonitorPanel.less";
</style>
