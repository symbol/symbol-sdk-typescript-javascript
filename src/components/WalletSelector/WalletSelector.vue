<template>
  <div v-if="currentWallets.length" class="switch_wallet">
    <img class="select_wallet_icon" src="@/views/resources/img/window/windowWalletSelect.png">
    <i-select v-model="currentWalletName">
      <i-option v-for="(item, index) in currentWallets" :key="index" :value="item">
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
