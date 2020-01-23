<template>
  <div v-if="currentAccount && currentAccount.values.get("wallets").length" class="switch_wallet">
    <img class="select_wallet_icon" src="@/common/img/window/windowWalletSelect.png">
    <i-select v-model="currentWalletName">
      <i-option v-for="(item, index) in currentAccount.values.get("wallets")" :key="index" :value="item">
        {{ item }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import {WalletSelectorTs} from './WalletSelectorTs'
import './WalletSelector.less'

export default class WalletSelector extends WalletSelectorTs {}
</script>
