<template>
  <div class="account-detail-row-3cols">
    <span class="label">{{ $t('account_public_key') }}</span>
    <div class="value accountPublicKey">
      {{ account.publicKey }}
      <img
        src="@/views/resources/img/account/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(account.publicKey)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { AccountPublicKeyDisplayTs } from './AccountPublicKeyDisplayTs'
export default class AccountPublicKeyDisplay extends AccountPublicKeyDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: 0.24rem;
  height: 0.24rem;
  margin-left: 0.18rem;
  cursor: pointer;
}

.accountPublicKey {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
</style>
