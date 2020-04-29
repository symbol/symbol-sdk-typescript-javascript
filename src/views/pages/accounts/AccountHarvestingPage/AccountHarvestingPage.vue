<template>
  <div class="account-detail-outer-container">
    <div class="account-detail-inner-container">
      <div class="account-actions-container">
        <AccountActions :account="currentAccount" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {AccountHarvestingPageTs} from './AccountHarvestingPageTs'

export default class AccountHarvestingPage extends AccountHarvestingPageTs {}
</script>

<style lang="less" scoped>
@import './AccountHarvestingPage.less';
</style>
