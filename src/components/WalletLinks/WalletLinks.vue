<template>
  <div class="wallet-links-container">
    <div class="wallet-link" @click="$router.push({name: 'dashboard'})">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/Dashboard.png"></div>
      <div class="info">
        <span>{{ $t('wallets_view_dashboard') }}</span>
      </div>
    </div>
    <div class="wallet-link" @click="openExplorer()">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/Explorer.png"></div>
      <div class="info">
        <span>{{ $t('wallets_view_explorer_description') }}</span>
      </div>
    </div>
    <div class="wallet-link" @click="openFaucet()">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/Mosaic.png"></div>
      <div class="info">
        <span>{{ $t('wallets_view_open_faucet') }}</span>
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
