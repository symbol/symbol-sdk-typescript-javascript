<template>
  <div class="wallets-main-container">
    <div class="left-container xym-outline">
      <WalletSelectorPanel />
    </div>
    <div class="right-container xym-outline">
      <div class="header-container">
        <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
      </div>

      <div class="bottom-container">
        <router-view />
      </div>
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
