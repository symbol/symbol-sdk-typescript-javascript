<template>
  <div class="finish-sec" @keyup.enter="submit">
    <img src="@/common/img/success.png" alt/>
    <span class="set-title"> {{$t('Import_successful')}}</span>
    <p class="set-title-tips">{{$t('Import_your_account_successful')}}</p>
    <div class="finish-col">
      <div class="finish-left">
        <p class="text1">{{$t('Safe_storage_tips')}}</p>
        <p class="text">{{$t('Save_backups')}}</p>
        <p class="text">{{$t('Don_not_share_mnemonics_with_anyone')}}</p>
        <p class="text">{{$t('Beware_of_phishing_Nano_wallet_does_not_naturally_ask_you_to_enter_a_mnemonic')}}</p>
        <p class="text">
          {{$t('If_you_need_to_back_up_your_mnemonics_again_you_can_find_them_in_Wallet_Management_Wallet_Details_Export_Mnemonics')}}</p>
        <p class="text">{{$t('Nem_wallet_can_not_recover_your_mnemonic')}}</p>
        <div class="jump-btn">
          <button @click="$router.push('dashboard')">{{$t('next')}}</button>
        </div>
      </div>
      <div class="finish-right">
        <img src="@/common/img/finish.png" alt/>
      </div>
    </div>
  </div>
</template>

<script>
  import FinishImportTs from "./FinishImportTs";

  export default class FinishImport extends FinishImportTs {
  }
</script>

<style scoped lang="less">
  @import "FinishImport.less";
</style>
