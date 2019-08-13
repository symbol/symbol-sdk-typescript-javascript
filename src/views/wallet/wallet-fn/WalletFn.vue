<template>
  <div class="WalletFnWrap">
    <div class="walletFnNav">
      <ul class="navList clear">
        <li :class="[item.active?'active':'','left']"
            v-for="(item,index) in navList"
            :key="index"
            @click="goToPage(item,index)"
        >{{$t(item.name)}}
        </li>
      </ul>
    </div>
    <div class="walletFnContent">
      <WalletCreate v-if="Index === 0 && !walletCreated" @isCreated="isCreated"
                    @closeCreate="closeCreate"></WalletCreate>
      <WalletCreated :createForm='createForm' @toWalletDetails="toWalletDetails" @closeCreated="closeCreated"
                     v-if="walletCreated"></WalletCreated>
      <WalletImport v-if="Index === 1" @toWalletDetails="toWalletDetails" @closeImport="closeImport"></WalletImport>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletFn.less'
    import {WalletFnTs} from './WalletFnTs'

    export default class WalletFn extends WalletFnTs {

    }
</script>

<style scoped>

</style>
