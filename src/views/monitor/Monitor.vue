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
        <div class="XEM_amount overflow_ellipsis">
          <div>{{ticker}}</div>
          <div class="amount">{{formatNumber(balance)}}</div>
        </div>
        <div class="exchange">
          {{ xemUsdPrice > 0 ? `$${formatNumber(balance*xemUsdPrice)}` : '' }}
        </div>
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
                  class="mosaic_data text_select"
                  v-for="(mosaic, index) in filteredList"
                  :key="index"
                >
                  <span class="img_container">
                    <img v-if="index == 0" src="@/common/img/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="@/common/img/monitor/mosaicDefault.png" alt="">
                  </span>
                  <span class="mosaic_name">{{mosaic.name || mosaic.hex}}</span>
                  <span class="mosaic_value">
                    <div>{{formatNumber(mosaic.balance || 0)}}</div>
                  </span>
                </div>
              </div>
            </TabPane>
          </Tabs>

          <!--        sevral      -->
          <div v-if="isShowManageMosaicIcon" class="searchMosaic secondary_page_animate">
            <img src="@/common/img/monitor/monitorLeftArrow.png" class="asset_setting_tit pointer"
                 @click="showMosaicMap" alt="">
            <div class="input_outter">

              <img src="@/common/img/monitor/monitorSearchIcon.png" alt="">
              <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
              <span class="search pointer" @click="searchMosaic">{{$t('search')}}</span>

            </div>
            <div class="mosaicList">
              <div class="toggle_all_checked ">
                  <span @click="toggleAllChecked()">
                    <div :class="['choose',  isChecked ? 'true' : 'false']"></div>
                    {{ !isChecked ? $t('select_all'):$t('all_unchecked')}}
                  </span>
                <span @click="toggleShowExpired()">
                    <div :class="['choose',  showExpiredMosaics ? 'true' : 'false']"></div>
                    {{$t('Display_expired_mosaic')}}
                  </span>
              </div>
              <div
                  :class="['mosaic_data',index == 0?'padding_top_0':'']"
                  v-for="(mosaic, index) in mosaicList"
                  :key="index"
                  class="mosaic_data pointer text_select"
                  @click="toggleShowMosaic(mosaic)"
                >
                <span class="namege_img "  >
                 <img class="small_icon " :src="mosaic.hide?monitorUnselected:monitorSelected">
                  <img v-if="index == 0" class="mosaicIcon"
                       src="@/common/img/monitor/monitorMosaicIcon.png">
                  <img v-else class="mosaicIcon" src="@/common/img/monitor/mosaicDefault.png">
                </span>
                <span class="mosaic_name text_select">{{mosaic.name || mosaic.hex}}</span>
                <span class="mosaic_value">
                  <div>{{formatNumber(mosaic.balance || 0)}}</div>
                </span>
              </div>
              <div class="complete_container">
                <div class="complete" @click="showMosaicMap">{{$t('Close')}}</div>
              </div>
              <div class="mosaic_data"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="monitor_panel_right_container">
      <div class="top_network_info radius">
        <div class="top_wallet_info">
          <div class="netWork radius">
            <div class="title">
              <span class="title_txt">{{$t('nodes')}}</span>
            </div>
            <img src="@/common/img/monitor/network.png"/>
            <span class="txt_info"><numberGrow :value="chainStatus.nodeNumber"></numberGrow></span>
          </div>
          <div class="block_height radius">
            <div class="title">
              <span class="title_txt">{{$t('blocks')}}</span>
            </div>
            <img src="@/common/img/monitor/block_height.png"/>
            <span class="txt_info">
            <numberGrow :value="currentHeight"></numberGrow>
          </span>
          </div>
          <div class="amount radius">
            <div class="title">
              <span class="title_txt">{{$t('transactions')}}</span>
            </div>
            <img src="@/common/img/windowDashboardActive.png"/>
            <span class="txt_info">
            <numberGrow :value="chainStatus.numTransactions"></numberGrow>
          </span>
          </div>
          <div class="block_time radius">
            <div class="title">
              <span class="title_txt">{{$t('time')}} <span  class="title_txt">{{chainStatus.getTimeFromBlockNumber(chainStatus.currentHeight)}}</span></span>
            </div>
            <img src="@/common/img/monitor/amount.png"/>
            <span class="txt_info">
            <numberGrow :value="chainStatus.targetBlockTime"></numberGrow>
          </span>
          </div>
        </div>
      </div>
      <div class="top_navidator radius">
        <span
                v-for="({path, name, active}, index) in routes"
                :key="index"
                :class="[
                    active ? 'active_navigator' : '',
                    'outter_container',
                    'radius',
                    active ? 'disabled' : 'pointer'
                ]"
                @click="active ? '' : $router.push(path).catch(err => {})"
        >
          <span class="inner_container absolute">{{$t(name)}}</span>
          <span class="line">|</span>
        </span>
      </div>
      <div class="radius bottom_router_view">
        <router-view/>
      </div>
      <div class="transaction_status radius"/>
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MonitorTs} from '@/views/monitor/MonitorTs.ts'

    export default class Monitor extends MonitorTs {

    }
</script>

<style scoped lang="less">
  @import "Monitor.less";
</style>
