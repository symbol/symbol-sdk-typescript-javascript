<template>
  <div class="detail-double-row">
    <div class="detail-row">
      <div class="wallet-detail-row-3cols">
        <span class="label">{{ $t('Wallet_address') }}</span>
        <span class="value walletAddress">{{ wallet.objects.address.pretty() }}</span>
        <span><img
          src="@/views/resources/img/wallet/copyIcon.png"
          class="copy-icon"
          @click="uiHelpers.copyToClipboard(wallet.objects.address.plain())"
        ></span>
      </div>
    </div>
    <div class="detail-row">
      <div class="wallet-detail-row-3cols">
        <span class="label">{{ $t('Wallet_public_key') }}</span>
        <span class="value walletPublicKey">{{ wallet.objects.publicAccount.publicKey }}</span>
        <span><img
          src="@/views/resources/img/wallet/copyIcon.png"
          class="copy-icon"
          @click="uiHelpers.copyToClipboard(wallet.objects.publicAccount.publicKey)"
        ></span>
      </div>
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
.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}
</style>
