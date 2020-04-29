<template>
  <div class="accounts-main-container">
    <div class="left-container xym-outline">
      <AccountSelectorPanel />
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
import {AccountsTs} from './AccountsTs'
export default class Accounts extends AccountsTs {}
</script>

<style lang="less" scoped>
@import './Accounts.less';
</style>
