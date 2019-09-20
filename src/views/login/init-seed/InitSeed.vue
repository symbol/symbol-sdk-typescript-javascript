<template>
  <div class="init_seed radius">
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
    <div class="walletFnContent radius">
      <AccountCreateMnemonic
              v-if="pageIndex === 0  "
              @isCreated="isCreated"
              @updatePageIndex="updatePageIndex">
      </AccountCreateMnemonic>
      <AccountImportMnemonic
              v-if="pageIndex === 1  "
              @updatePageIndex="updatePageIndex"
      >
      </AccountImportMnemonic>
      <SeedCreatedGuide
              v-if="pageIndex === 2 "
              :createForm='createForm'
              @updatePageIndex="updatePageIndex"
      >
      </SeedCreatedGuide>
    </div>
  </div>
</template>

<script lang="ts">
    import './InitSeed.less'
    //@ts-ignore
    import {InitSeedTs} from '@/views/login/init-seed/InitSeedTs.ts'

    export default class WalletCreate extends InitSeedTs {

    }
</script>

<style scoped>

</style>
