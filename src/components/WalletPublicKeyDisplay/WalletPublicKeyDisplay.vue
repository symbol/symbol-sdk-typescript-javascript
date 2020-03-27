<template>
  <div class="wallet-detail-row-3cols">
    <span class="label">{{ $t('Wallet_public_key') }}</span>
    <div class="value walletPublicKey">
      {{ wallet.objects.publicAccount.publicKey }}
      <img
        src="@/views/resources/img/wallet/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(wallet.objects.publicAccount.publicKey)"
      >
    </div>
  </div>
</template>

<script lang="ts">
import {WalletPublicKeyDisplayTs} from './WalletPublicKeyDisplayTs'
export default class WalletPublicKeyDisplay extends WalletPublicKeyDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}

.walletPublicKey {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
</style>
