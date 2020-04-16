<template>
  <div class="mosaics-list-container">
    <Tabs v-if="!isEditionMode" size="small">
      <TabPane :label="$t('assets')" name="name1">
        <div class="mosaicList secondary_page_animate">
          <div
            v-for="(entry, index) in filteredBalanceEntries"
            :key="index"
            class="mosaic_data"
          >
            <span class="img_container">
              <img
                v-if="entry.id.equals(networkMosaic)"
                src="@/views/resources/img/symbol/XYMCoin.png" alt
              >
              <img v-else src="@/views/resources/img/symbol/XYMCoin.png" class="grayed-xym-logo">
            </span>
            <span class="mosaic_name">{{ entry.name !== '' ? entry.name : entry.id.toHex() }}</span>
            <span class="mosaic_value">
              <MosaicAmountDisplay :id="entry.id" :relative-amount="entry.amount" :size="'normal'" />
            </span>
          </div>
        </div>
      </TabPane>
      <img
        slot="extra"
        class="asset_list pointer"
        src="@/views/resources/img/monitor/monitorAssetList.png"
        @click="isEditionMode = true"
      >
    </Tabs>
    <div v-else class="searchMosaic secondary_page_animate">
      <img
        src="@/views/resources/img/monitor/monitorLeftArrow.png"
        class="asset_setting_tit pointer"
        alt
        @click="isEditionMode = false"
      >
      <div class="mosaicList">
        <div class="toggle_all_checked">
          <span @click="toggleMosaicDisplay()">
            <img
              class="toggle-mosaic-display-icon"
              :src=" areAllMosaicsShown()
                ? dashboardImages.selected
                : dashboardImages.unselected"
            >
            {{ areAllMosaicsShown() ? $t('uncheck_all') : $t('select_all') }}
          </span>
        </div>

        <div
          v-for="(entry, index) in allBalanceEntries"
          :key="index"
          :class="[ 'mosaic_data',index === 0 ? 'padding_top_0' : '' ]"
          class="mosaic_data pointer"
          @click="toggleMosaicDisplay(entry.id)"
        > 
          <span class="namege_img">
            <img
              class="small_icon"
              :src="isMosaicHidden(entry.id)
                ? dashboardImages.unselected
                : dashboardImages.selected"
            >
            <img
              v-if="entry.id.equals(networkMosaic)"
              src="@/views/resources/img/symbol/XYMCoin.png"
              class="mosaicIcon"
            >
            <img
              v-else
              src="@/views/resources/img/symbol/XYMCoin.png"
              class="mosaicIcon grayed-xym-logo"
            >
          </span>
          <span class="mosaic_name">
            {{ entry.name !== '' ? entry.name : entry.id.toHex() }}
          </span>
          <span class="mosaic_value">
            <MosaicAmountDisplay
              :id="entry.id"
              :relative-amount="entry.amount"
              :size="'normal'"
            />
          </span>
        </div>
        <div class="complete_container">
          <div class="complete" @click="isEditionMode = false">
            {{ $t('Close') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { MosaicBalanceListTs } from './MosaicBalanceListTs'
import './MosaicBalanceList.less'

export default class MosaicBalanceList extends MosaicBalanceListTs {}
</script>
