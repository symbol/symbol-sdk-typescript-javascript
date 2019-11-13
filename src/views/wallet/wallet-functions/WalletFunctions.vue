<template>
  <div class="WalletFnWrap">
    <div class="walletFnNav">
      <ul class="navList clear">
        <li :class="[item.active?'active':'','left']"
            v-for="(item,index) in navList"
            :key="index"
            @click="goToPage(index)"
        >{{$t(item.name)}}
        </li>
      </ul>
    </div>
    <div class="walletFnContent">
      <WalletCreate
              v-if="currentIndex === 0 && !walletCreated"
              @toWalletDetails="$emit('toWalletDetails')"
      ></WalletCreate>
      <WalletCreated
              :createForm='createForm'
              @toWalletDetails="$emit('toWalletDetails')"
              v-if="walletCreated"
      ></WalletCreated>
      <WalletImport
              v-if="currentIndex === 1"
              @toWalletDetails="$emit('toWalletDetails')"
      ></WalletImport>
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
