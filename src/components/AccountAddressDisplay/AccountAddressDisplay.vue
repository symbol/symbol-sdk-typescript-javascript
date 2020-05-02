<template>
  <div class="account-detail-row-3cols">
    <span class="label">{{ $t('account_address') }}</span>
    <div class="value accountAddress">
      {{ getAccountPrettyAddress() }}
      <img
        src="@/views/resources/img/account/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(account.address)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AccountAddressDisplayTs } from './AccountAddressDisplayTs'
export default class AccountAddressDisplay extends AccountAddressDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: 0.24rem;
  height: 0.24rem;
  margin-left: 0.18rem;
  cursor: pointer;
}

.accountAddress {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
</style>
