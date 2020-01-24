<template>
  <div class="top_network_info radius">
    <div class="top_wallet_info">
      <div class="netWork radius">
        <div class="title">
          <span class="title_txt">{{ $t('accounts') }}</span>
        </div>
        <img src="@/common/img/monitor/network.png">
        <span class="txt_info"><numberGrow :value="countAccounts" /></span>
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
          <numberGrow :value="countTransactions" />
        </span>
      </div>
      <div class="block_time radius">
        <div class="title">
          <span class="title_txt">
            {{ $t('nodeUrl') }}:&nbsp;
            <span class="title_txt">
              {{ currentPeerInfo ? currentPeerInfo.friendlyName : $t('loading') }}
            </span></span>
        </div>
        <img src="@/common/img/monitor/amount.png">
        <span class="txt_info">
          <numberGrow :value="countNodes" />
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
