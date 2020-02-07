<template>
  <div class="wallet-details-container">
    <div class="detail-row">
      <span class="wallet-detail-label">{{ $t('Wallet_address') }}</span>
      <span class="walletAddress">{{ wallet.objects.address.pretty() }}</span>
      <img
        src="@/views/resources/img/wallet/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(wallet.objects.address.pretty())"
      >
    </div>
    <div class="detail-row">
      <span class="wallet-detail-label">{{ $t('Wallet_public_key') }}</span>
      <span class="walletPublicKey">{{ wallet.objects.publicAccount.publicKey }}</span>
      <img
        src="@/views/resources/img/wallet/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(wallet.objects.publicAccount.publicKey)"
      >
    </div>
    <!--
    <p class="link_text">
      <span class="tit">{{ $t('Aliases') }}</span>
      <span class="  alias_add pointer" @click="bindNamespace()" />
      <span class="walletPublicKey">
        <span v-if="!selfAliases.length">-</span>
        <div v-if="selfAliases.length">
          <span v-for="(alias, index) in selfAliases" :key="index">
            <span class="aliasLink">
              <a @click="unbindNamespace(alias)">{{ alias.name }}</a>
              {{ index < selfAliases.length - 1 ? ' | ' : '' }}
            </span>
          </span>
        </div>
      </span>
    </p>
-->
  </div>
</template>

<script lang="ts">
import {WalletDetailsDisplayTs} from './WalletDetailsDisplayTs'
export default class WalletDetailsDisplay extends WalletDetailsDisplayTs {}
</script>

<style lang="less" scoped>
@import '../WalletDetails/WalletDetails.less';

.wallet-details-container {
  height: 100%;
  display: grid;
}

.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}
</style>
