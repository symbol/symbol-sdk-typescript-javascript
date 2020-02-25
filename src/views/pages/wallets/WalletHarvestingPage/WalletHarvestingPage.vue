<template>
  <div class="wallet-detail-outer-container">
    <div class="wallet-detail-inner-container">
      <div class="wallet-actions-container">
        <WalletActions :wallet="currentWallet" />
      </div>
   </div>
  </div>
</template>

<script lang="ts">
import {WalletHarvestingPageTs} from './WalletHarvestingPageTs'
export default class WalletHarvestingPage extends WalletHarvestingPageTs {}
</script>

<style lang="less">
@import './WalletHarvestingPage.less';
</style>
