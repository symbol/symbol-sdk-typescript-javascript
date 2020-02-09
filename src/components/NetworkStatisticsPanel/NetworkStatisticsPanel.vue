<template>
  <div class="top_network_info radius">
    <div class="top_wallet_info">
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('accounts') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/network.png">
        <span class="txt_info">
          <AnimatedNumber v-model="countAccounts" />
        </span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('blocks') }}</span>
        </div>
        <img src="@/views/resources/img/monitor/block_height.png">
        <span class="txt_info">
          <AnimatedNumber v-model="currentHeight" />
        </span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">{{ $t('transactions') }}</span>
        </div>
        <img src="@/views/resources/img/windowDashboardActive.png">
        <span class="txt_info">
          <AnimatedNumber v-model="countTransactions" />
        </span>
      </div>
      <div class="xym-outline wallet-info-tile">
        <div class="title">
          <span class="title_txt">
            {{ $t('nodeUrl') }}:&nbsp;
            <span class="title_txt">
              {{ currentPeerInfo ? currentPeerInfo.friendlyName : $t('loading') }}
            </span></span>
        </div>
        <img src="@/views/resources/img/monitor/amount.png">
        <span class="txt_info">
          <AnimatedNumber v-model="countNodes" />
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {NetworkStatisticsPanelTs} from './NetworkStatisticsPanelTs'
import './NetworkStatisticsPanel.less'

export default class NetworkStatisticsPanel extends NetworkStatisticsPanelTs {}
</script>
