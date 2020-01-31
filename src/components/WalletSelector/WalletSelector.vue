<template>
  <div v-if="currentWallets.length" class="switch_wallet">
    <img class="select_wallet_icon" src="@/views/resources/img/window/windowWalletSelect.png">
    <i-select v-model="currentWalletIdentifier">
      <i-option
        v-for="({identifier, name}) in currentWallets"
        :key="identifier"
        :value="identifier"
      >
        {{ name }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import {WalletSelectorTs} from './WalletSelectorTs'
import './WalletSelector.less'

export default class WalletSelector extends WalletSelectorTs {}
</script>
