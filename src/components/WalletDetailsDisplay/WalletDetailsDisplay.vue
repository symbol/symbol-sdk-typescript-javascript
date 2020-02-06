<template>
  <div>
    <p>
      <span class="tit">{{ $t('Wallet_address') }}</span>
      <span class="walletAddress">{{ wallet.objects.address.plain() }}</span>
      <i class="copyIcon"
         @click="UIHelpers.copyToClipboard(wallet.objects.address.plain())">
        <img src="@/views/resources/img/wallet/copyIcon.png"></i>
    </p>

    <p>
      <span class="tit">{{ $t('Wallet_public_key') }}</span>
      <span class="walletPublicKey">{{ wallet.objects.publicAccount.publicKey }}</span>
      <i class="copyIcon" @click="UIHelpers.copyToClipboard(wallet.objects.publicAccount.publicKey)">
        <img src="@/views/resources/img/wallet/copyIcon.png" />
      </i>
    </p>
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
import './WalletDetailsDisplay.less'

export default class WalletDetailsDisplay extends WalletDetailsDisplayTs {}
</script>
