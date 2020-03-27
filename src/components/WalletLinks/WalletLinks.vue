<template>
  <div class="wallet-details-grid mt-3">
    <div class="detail-row">
      <div class="wallet-detail-row">
        <span class="label">{{ $t('wallets_links_explorer') }}</span>
        <div class="value">
          <a :href="explorerUrl" target="_blank">{{ $t('wallets_view_explorer_description') }}</a>
        </div>
      </div>
    </div>

    <div class="detail-row">
      <div class="wallet-detail-row">
        <span class="label">{{ $t('wallets_links_faucet') }}</span>
        <div class="value">
          <a :href="faucetUrl" target="_blank">{{ $t('wallets_view_open_faucet') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletLinksTs} from './WalletLinksTs'
import './WalletLinks.less'

export default class WalletLinks extends WalletLinksTs {}
</script>

<style lang="less" scoped>
.edit-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
