<template>
  <div class="monitor_panel_container">
    <div ref="monitorPanelLeftContainer" class="monitor_panel_left_container">
      <div class="top_wallet_address radius">
        <div class="wallet_address">
          <span class="address">
            {{ address }}
          </span>
          <img class="pointer" src="@/common/img/monitor/monitorCopyAddress.png" @click="copyAddress">
        </div>

        <div class="split" />
        <div class="XEM_amount overflow_ellipsis">
          <div>{{ ticker }}</div>
          <div class="amount">
            <NumberFormatting :number-of-formatting="balance" />
          </div>
        </div>
        <!-- <div class="exchange">
          @TODO: make usdBalance a getter once we have a data source
          <NumberFormatting :number-of-formatting="usdBalance" />
        </div> -->
      </div>
      <div ref="bottomAccountInfo" class="bottom_account_info radius">
        <div v-if="isShowAccountInfo" class="mosaicListWrap">
          <Spin
            v-if="mosaicsLoading" size="large" fix
            class="absolute"
          />
          <Tabs v-if="!isShowManageMosaicIcon" size="small">
            <TabPane :label="$t('assets')" name="name1">
              <img
                class="asset_list pointer" src="@/common/img/monitor/monitorAssetList.png"
                @click="manageMosaicList()"
              >
              <div class="mosaicList secondary_page_animate">
                <div
                  v-for="(mosaic, index) in filteredList"
                  :key="index"
                  class="mosaic_data text_select"
                >
                  <span class="img_container">
                    <img v-if="index === 0" src="@/common/img/monitor/monitorMosaicIcon.png" alt="">
                    <img v-else src="@/common/img/monitor/mosaicDefault.png" alt="">
                  </span>
                  <span class="mosaic_name">{{ mosaic.name || mosaic.hex }}</span>
                  <span class="mosaic_value">
                    <NumberFormatting :number-of-formatting="formatNumber(mosaic.balance || 0)" />
                  </span>
                </div>
              </div>
            </TabPane>
          </Tabs>

          <div v-if="isShowManageMosaicIcon" class="searchMosaic secondary_page_animate">
            <img
              src="@/common/img/monitor/monitorLeftArrow.png" class="asset_setting_tit pointer"
              alt="" @click="showMosaicMap"
            >
            <div class="input_outter">
              <img src="@/common/img/monitor/monitorSearchIcon.png" alt="">
              <input v-model="mosaicName" type="text" :placeholder="$t('search_for_asset_name')">
              <span class="search pointer" @click="searchMosaic">{{ $t('search') }}</span>
            </div>
            <div class="mosaicList">
              <div class="toggle_all_checked ">
                <span @click="toggleAllChecked()">
                  <div :class="[ 'choose', isChecked ? 'true' : 'false' ]" />
                  {{ !isChecked ? $t('select_all') : $t('all_unchecked') }}
                </span>
                <span @click="toggleShowExpired()">
                  <div :class="[ 'choose', showExpiredMosaics ? 'true' : 'false' ]" />
                  {{ $t('Display_expired_mosaic') }}
                </span>
              </div>
              <div
                v-for="(mosaic, index) in mosaicList"
                :key="index"
                :class="[ 'mosaic_data',index === 0 ? 'padding_top_0' : '' ]"
                class="mosaic_data pointer text_select"
                @click="toggleShowMosaic(mosaic)"
              >
                <span class="namege_img ">
                  <img class="small_icon " :src="mosaic.hide ? monitorUnselected : monitorSelected">
                  <img
                    v-if="index === 0" class="mosaicIcon"
                    src="@/common/img/monitor/monitorMosaicIcon.png"
                  >
                  <img v-else class="mosaicIcon" src="@/common/img/monitor/mosaicDefault.png">
                </span>
                <span class="mosaic_name text_select">{{ mosaic.name || mosaic.hex }}</span>
                <span class="mosaic_value">
                  <NumberFormatting :number-of-formatting="formatNumber(mosaic.balance || '0')" />
                </span>
              </div>
              <div class="complete_container">
                <div class="complete" @click="showMosaicMap">
                  {{ $t('Close') }}
                </div>
              </div>
              <div class="mosaic_data" />
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
              <span class="title_txt">{{ $t('nodes') }}</span>
            </div>
            <img src="@/common/img/monitor/network.png">
            <span class="txt_info"><numberGrow :value="NetworkProperties.nodeNumber" /></span>
          </div>
          <div class="block_height radius">
            <div class="title">
              <span class="title_txt">{{ $t('blocks') }}</span>
            </div>
            <img src="@/common/img/monitor/block_height.png">
            <span class="txt_info">
              <numberGrow :value="currentHeight" />
            </span>
          </div>
          <div class="amount radius">
            <div class="title">
              <span class="title_txt">{{ $t('transactions') }}</span>
            </div>
            <img src="@/common/img/windowDashboardActive.png">
            <span class="txt_info">
              <numberGrow :value="NetworkProperties.numTransactions" />
            </span>
          </div>
          <div class="block_time radius">
            <div class="title">
              <span class="title_txt">
                {{ $t('time') }}
                <span class="title_txt">
                  {{ NetworkProperties.getTimeFromBlockNumber(NetworkProperties.height) }}
                  span>
                  an>
                </span></span>
            </div>
            <img src="@/common/img/monitor/amount.png">
            <span class="txt_info">
              <numberGrow :value="NetworkProperties ? NetworkProperties.targetBlockTime : defaultTargetBlockTime" />
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
          <span class="inner_container absolute">{{ $t(name) }}</span>
          <span class="line">|</span>
        </span>
      </div>
      <div class="radius bottom_router_view">
        <router-view />
      </div>
      <div class="transaction_status radius" />
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
