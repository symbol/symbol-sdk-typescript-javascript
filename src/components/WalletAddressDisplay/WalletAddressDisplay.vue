<template>
  <div class="wallet-detail-row-3cols">
    <span class="label">{{ $t('Wallet_address') }}</span>
    <div class="value walletAddress">
      {{ wallet.objects.address.pretty() }}
      <img
        src="@/views/resources/img/wallet/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(wallet.objects.address.plain())"
      >
    </div>
  </div>
</template>

<script lang="ts">
import {WalletAddressDisplayTs} from './WalletAddressDisplayTs'
export default class WalletAddressDisplay extends WalletAddressDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}

.walletAddress {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}
</style>
