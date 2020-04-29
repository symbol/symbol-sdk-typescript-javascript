<template>
  <div class="account-detail-row-3cols">
    <span class="label">{{ $t('account_address') }}</span>
    <div class="value accountAddress">
      {{ getAccountPrettyAddress() }}
      <img
        src="@/views/resources/img/account/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(account.address)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import {AccountAddressDisplayTs} from './AccountAddressDisplayTs'
export default class AccountAddressDisplay extends AccountAddressDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}

.accountAddress {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
</style>
