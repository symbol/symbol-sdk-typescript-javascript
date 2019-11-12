<template>
  <div class="walletImportWrap  radius">
    <div class="setting_main_container">
      <div class="left_wallet_import_navigator left">
        <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navigatorList">
          <span :class="n.isSelected ? 'selected_title':''">{{$t(n.title)}}</span>
        </div>
      </div>
      <div class="right_view scroll right">
        <div class="top_title">
          {{$t('import')}}{{$t(currentHeadText)}}
        </div>
        <div class="main_view">
          <WalletImportKeystore v-if="tabIndex === 1" @toWalletDetails="$emit('toWalletDetails')">
          </WalletImportKeystore>
          <WalletImportPrivatekey v-else-if="tabIndex === 0" @toWalletDetails="$emit('toWalletDetails')">
          </WalletImportPrivatekey>
          <AccountImportHardware v-else-if="$store.state.app._ENABLE_TREZOR_ && tabIndex === 2" @toWalletDetails="$emit('toWalletDetails')">
          </AccountImportHardware>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletImport.less'
    //@ts-ignore
    import {WalletImportTs} from '@/views/wallet/wallet-functions/wallet-import/WalletImportTs.ts'

    export default class WalletImport extends WalletImportTs {

    }
</script>

<style scoped>

</style>
