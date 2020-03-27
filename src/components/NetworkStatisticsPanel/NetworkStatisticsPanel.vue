<template>
  <div class="top_network_info radius">
    <div class="top_wallet_info">
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('accounts') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/peer_number.png">
        <span class="txt_info">
          <AnimatedNumber v-model="countAccounts" />
        </span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('chain_height') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/height.png">
        <span class="txt_info">
          <AnimatedNumber v-model="currentHeight" />
        </span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('speed') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/speed.png">
        <span class="txt_info speed">
          {{ targetBlockTime }}s
        </span>
        <span class="speed-blocks">/{{ $t('block') }}</span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('peers_number') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/peer.png">
        <span class="txt_info">
          <AnimatedNumber v-model="countNodes" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { NetworkStatisticsPanelTs } from './NetworkStatisticsPanelTs'
import './NetworkStatisticsPanel.less'

export default class NetworkStatisticsPanel extends NetworkStatisticsPanelTs {}
</script>
