<template>
  <div class="balances-panel-outer-container">
    <div class="balances-panel-container">
      <div
        :class="{
          top_account_address: true,
          radius: true,
          grayed: isCosignatoryMode,
          purpled: !isCosignatoryMode,
          'xym-outline': true,
        }"
      >
        <div v-if="currentSignerAddress" class="account_address">
          <span class="address">
            {{ currentSignerAddress.plain() }}
          </span>
          <img
            class="pointer"
            src="@/views/resources/img/monitor/monitorCopyAddress.png"
            @click="uiHelpers.copyToClipboard(currentSignerAddress.plain())"
          />
        </div>
        <div v-if="networkCurrency" class="XEM_amount overflow_ellipsis">
          <div>{{ networkCurrency.ticker }}</div>
          <div class="amount">
            <MosaicAmountDisplay :absolute-amount="absoluteBalance" :size="'biggest'" />
          </div>
        </div>
        <img
          class="balance-background"
          src="@/views/resources/img/monitor/dash-board/dashboardWalletBalanceBackground.png"
        />
      </div>

      <div class="bottom_account_info radius xym-outline">
        <Spin v-if="!balanceMosaics.length" size="large" fix class="absolute" />
        <MosaicBalanceList />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ProfileBalancesPanelTs } from './ProfileBalancesPanelTs'
import './ProfileBalancesPanel.less'

export default class ProfileBalancesPanel extends ProfileBalancesPanelTs {}
</script>
