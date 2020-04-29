<template>
  <div class="account-details-grid mt-3">
    <div class="detail-row">
      <div class="account-detail-row">
        <span class="label">{{ $t('accounts_links_explorer') }}</span>
        <div class="value">
          <a :href="explorerUrl" target="_blank">{{ $t('accounts_view_explorer_description') }}</a>
        </div>
      </div>
    </div>

    <div class="detail-row">
      <div class="account-detail-row">
        <span class="label">{{ $t('accounts_links_faucet') }}</span>
        <div class="value">
          <a :href="faucetUrl" target="_blank">{{ $t('accounts_view_open_faucet') }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {AccountLinksTs} from './AccountLinksTs'
import './AccountLinks.less'

export default class AccountLinks extends AccountLinksTs {}
</script>

<style lang="less" scoped>
.edit-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
