<template>
  <div class="init_seed radius">
    <div class="walletFnNav" v-if="pageIndex !== -1">
      <ul class="navList clear">
        <li :class="[item.active?'active':'','left']"
            v-for="(item,index) in navList"
            :key="index"
            @click="goToPage(index)"
        >
          {{$t(item.name)}}
        </li>
      </ul>
    </div>

    <SeedCreatedGuide
            v-if="pageIndex === -1"
            :createForm='createForm'
            @updatePageIndex="updatePageIndex"
    >
    </SeedCreatedGuide>

    <div class="walletFnContent radius" v-else>

      <AccountImportMnemonic
              v-if="pageIndex === 1"
              @updatePageIndex="updatePageIndex"
      >
      </AccountImportMnemonic>
      <AccountImportHardware
              v-if="pageIndex === 2"
              @updatePageIndex="updatePageIndex"
      >
      </AccountImportHardware>
    </div>
    <CheckPasswordDialog
            :showCheckPWDialog="navList[0].active"
            :isOnlyCheckPassword="true"
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    ></CheckPasswordDialog>
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
