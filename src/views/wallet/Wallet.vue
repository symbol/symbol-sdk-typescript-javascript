<template>
  <div class="WalletPanelWrap clear">
    <div class="hasWalletPanel" v-if="!toMethod && wallet && walletList.length">
      <div class="left WalletSwitch">
        <WalletSwitch
                @noHasWallet="noHasWallet"
                @toCreate="toCreate"
                @toImport="toImport"/>
      </div>
      <div class="left WalletFn">
        <WalletDetails/>
      </div>
    </div>
    <div class="walletMethods" v-if="tabIndex!==-1">
      <WalletFn v-if="tabIndex!==-1" @toWalletDetails="toWalletDetails"/>
    </div>
  </div>
</template>

<script lang="ts">
    import './Wallet.less'
    import {WalletTs} from '@/views/wallet/WalletTs.ts'

    export default class Wallet extends WalletTs {

    }

</script>

<style scoped>

</style>
