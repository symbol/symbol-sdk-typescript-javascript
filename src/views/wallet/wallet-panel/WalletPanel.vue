<template>
  <div class="WalletPanelWrap clear">
    <div class="hasWalletPanel" v-if="!toMethod&&walletList.length > 0">
      <div class="left WalletSwitch">
        <WalletSwitch
                @noHasWallet="noHasWallet"
                @hasWallet="hasWallet"
                @toCreate="toCreate"
                @toImport="toImport"
        ></WalletSwitch>
      </div>
      <div class="left WalletFn">
        <WalletDetails></WalletDetails>
      </div>
    </div>
    <div class="walletMethods">
      <WalletFn :tabIndex="tabIndex" @backToGuideInto="backToGuideInto" @toWalletDetails="toWalletDetails"></WalletFn>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletPanel.less'
    import {WalletPanelTs} from './WalletPanelTs'

    export default class WalletPanel extends WalletPanelTs {

    }

</script>

<style scoped>

</style>
