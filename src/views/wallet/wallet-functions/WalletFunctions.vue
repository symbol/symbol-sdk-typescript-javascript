<template>
  <div class="WalletFnWrap">
    <div class="walletFnContent">
      <WalletImport  @toWalletDetails="$emit('toWalletDetails')"  ></WalletImport>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletFunctions.less'
    //@ts-ignore
    import {WalletFunctionsTs} from '@/views/wallet/wallet-functions/WalletFunctionsTs.ts'

    export default class WalletFunctions extends WalletFunctionsTs {

    }
</script>

<style scoped>

</style>
