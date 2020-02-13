<template>
  <div class="balances-panel-container">
    <div class="top_wallet_address radius">
      <div class="wallet_address">
        <span class="address">
          {{ currentWallet ? currentWallet.objects.address.plain() : $t('loading') }}
        </span>
        <img class="pointer"
          src="@/views/resources/img/monitor/monitorCopyAddress.png"
          @click="uiHelpers.copyToClipboard(currentWallet.objects.address.plain())" />
      </div>

      <div class="split" />
      <div class="XEM_amount overflow_ellipsis">
        <div>{{ networkMosaicTicker }}</div>
        <div class="amount">
          <MosaicAmountDisplay :relative-amount="networkMosaicBalance"
                               :id="networkMosaic"
                               :absolute="false"
                               :size="'biggest'" />
        </div>
      </div>
    </div>

    <div class="bottom_account_info radius">
      <div class="mosaicListWrap">
        <Spin
          v-if="!currentWallet || !currentWalletMosaics.length" size="large" fix
          class="absolute"
        />
        <MosaicBalanceList :mosaics="currentWalletMosaics" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {AccountBalancesPanelTs} from './AccountBalancesPanelTs'
import './AccountBalancesPanel.less'

export default class AccountBalancesPanel extends AccountBalancesPanelTs {}
</script>
