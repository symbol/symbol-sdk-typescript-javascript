<template>
  <div class="WalletPanelWrap clear">
    <div v-if="!!currentWallet" class="hasWalletPanel">
      <div class="left WalletSwitch">
        <WalletSelectorPanel />
      </div>
      <div class="left WalletFn">
        <WalletDetails :wallet="currentWallet" />
      </div>
    </div>
    <div>
      <WalletActions :wallet="currentWallet" />
    </div>
  </div>
</template>

<script lang="ts">
import {WalletsTs} from './WalletsTs'
import './Wallets.less'

export default class Wallets extends WalletsTs {}
</script>
