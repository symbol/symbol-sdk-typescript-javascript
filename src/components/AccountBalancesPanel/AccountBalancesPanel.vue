<template>
<div>
  <div class="top_wallet_address radius">
    <div class="wallet_address">
      <span class="address">
        {{ currentWallet ? currentWallet.address().plain() : $t('loading') }}
      </span>
      <img class="pointer" src="@/common/img/monitor/monitorCopyAddress.png" @click="uiHelpers.copyToClipboard">
    </div>

    <div class="split" />
    <div class="XEM_amount overflow_ellipsis">
      <div>{{ networkMosaicTicker }}</div>
      <div class="amount">
        <AmountDisplay :amount="networkMosaicBalance" />
      </div>
    </div>
  </div>
  <div ref="bottomAccountInfo" class="bottom_account_info radius">
    <div v-if="isShowAccountInfo" class="mosaicListWrap">
      <Spin v-if="!currentWallet || !currentWalletMosaics.length" size="large" fix class="absolute" />
      <MosaicBalanceList :mosaics="currentWalletMosaics" />
    </div>
  </div>
</div>
</template>

<script lang="ts">
import {AccountsBalancesPanelTs} from './AccountsBalancesPanelTs'
import './AccountsBalancesPanel.less'

export default class AccountsBalancesPanel extends AccountsBalancesPanelTs {}
</script>
