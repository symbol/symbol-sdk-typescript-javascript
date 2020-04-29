<template>
  <div class="account-detail-outer-container">
    <div class="backup-mnemonic-container">
      <div class="account-actions-container">
        <AccountBackupOptions :account="currentAccount" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {AccountBackupPageTs} from './AccountBackupPageTs'
export default class AccountBackupPage extends AccountBackupPageTs {}
</script>

<style lang="less">
@import './AccountBackupPage.less';
</style>
