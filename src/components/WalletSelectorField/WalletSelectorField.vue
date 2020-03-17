<template>
  <div v-if="currentWallets.length" class="switch_wallet">
    <img
      v-if="!defaultFormStyle" class="select_wallet_icon"
      src="@/views/resources/img/window/windowWalletSelect.png"
    >
    <i-select
      v-model="currentWalletIdentifier"
      :class="{'select-size select-style': defaultFormStyle, 'max-z-index': true }"
    >
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
import {WalletSelectorFieldTs} from './WalletSelectorFieldTs'
import './WalletSelectorField.less'

export default class WalletSelectorField extends WalletSelectorFieldTs {}
</script>
