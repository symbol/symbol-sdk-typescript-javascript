<template>
  <div class="walletImportWrap scroll radius">
    <div class="seeting_main_container">
      <div class="left_navigator left">
        <div class="navigator_item pointer" @click="jumpToView(n,index)" v-for="(n,index) in navagatorList">
          <span :class="n.isSelected ? 'selected_title':''">{{$t(n.title)}}</span>
        </div>
      </div>
      <div class="right_view right">
        <div class="top_title">
          {{$t('import')}}{{$t(currentHeadText)}}
        </div>
        <div class="main_view">
          <WalletImportMnemonic v-if="tabIndex === 0" @toWalletDetails="toWalletDetails"
                                @closeImport="closeImport"></WalletImportMnemonic>
          <WalletImportPrivatekey v-else-if="tabIndex === 1" @toWalletDetails="toWalletDetails"
                                  @closeImport="closeImport"></WalletImportPrivatekey>
          <WalletImportKeystore v-else-if="tabIndex === 2" @toWalletDetails="toWalletDetails"
                                @closeImport="closeImport"></WalletImportKeystore>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletImport.less'
    import {WalletImportTs} from './WalletImportTs'

    export default class WalletImport extends WalletImportTs {

    }
</script>

<style scoped>

</style>
