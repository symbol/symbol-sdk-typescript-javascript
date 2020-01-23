<template>
  <div class="finish-sec scroll" @keyup.enter="submit">
    <img src="@/common/img/success.png">
    <span class="set-title"> {{ $t('Create_successful') }}</span>
    <p class="set-title-tips">
      {{ $t('Create_successful_tips') }}
    </p>
    <div class="finish-col">
      <div class="finish-left">
        <p class="text1">
          {{ $t('Safe_storage_tips') }}
        </p>
        <p class="text">
          · {{ $t('Save_backups') }}
        </p>
        <p class="text">
          · {{ $t('Don_not_share_mnemonics_with_anyone') }}
        </p>
        <p class="text">
          · {{ $t('Beware_of_phishing_Nano_wallet_does_not_naturally_ask_you_to_enter_a_mnemonic') }}
        </p>
        <p class="text">
          ·
          {{ $t('If_you_need_to_back_up_your_mnemonics_again_you_can') }}
        </p>
        <p class="text">
          · {{ $t('Nem_wallet_can_not_recover_your_mnemonic') }}
        </p>
        <div class="jump-btn">
          <button class="info-button pointer" @click="$router.back()">
            {{ $t('Back') }}
          </button>
          <button class="pointer" @click="submit">
            {{ $t('next') }}
          </button>
        </div>
      </div>
      <div class="finish-right">
        <img src="@/common/img/finish.png" alt>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FinalizeTs from '@/views/login/create-account/finish-create/FinalizeTs.ts'

export default class Finalize extends FinalizeTs {
}
</script>

<style scoped lang="less">
  @import "Finalize.less";
</style>
