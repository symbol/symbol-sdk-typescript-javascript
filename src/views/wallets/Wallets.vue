<template>
  <div class="main-container">
    <div class="left-container">
      <WalletSelectorPanel />
    </div>
    <div class="right-container">
      <WalletDetails :wallet="currentWallet" />
    </div>
  </div>
</template>

<script lang="ts">
import {WalletsTs} from './WalletsTs'
export default class Wallets extends WalletsTs {}
</script>

<style lang="less" scoped>
@import './Wallets.less';
</style>
