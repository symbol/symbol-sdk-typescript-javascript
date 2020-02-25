<template>
  <div class="wallet-detail-outer-container">
    <div class="backup-mnemonic-container">
      <div class="wallet-actions-container">
        <WalletBackupOptions :wallet="currentWallet" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletBackupPageTs} from './WalletBackupPageTs'
export default class WalletBackupPage extends WalletBackupPageTs {}
</script>

<style lang="less">
@import './WalletBackupPage.less';
</style>
