<template>
  <div class="WalletPanelWrap clear">
    <div class="hasWalletPanel" v-if="!toMethod && wallet && walletList.length">
      <div class="left WalletSwitch">
        <WalletSwitch
                @noHasWallet="noHasWallet"
                @toCreate="toCreate"
                @toImport="toImport"
        ></WalletSwitch>
      </div>
      <div class="left WalletFn">
        <WalletDetails />
      </div>
    </div>
    <div class="walletMethods">
      <WalletFn :tabIndex="tabIndex" @backToGuideInto="backToGuideInto" @toWalletDetails="toWalletDetails"></WalletFn>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletPanel.less'
    //@ts-ignore
    import {WalletPanelTs} from '@/views/wallet/wallet-panel/WalletPanelTs.ts'

    export default class WalletPanel extends WalletPanelTs {

    }

</script>

<style scoped>

</style>
