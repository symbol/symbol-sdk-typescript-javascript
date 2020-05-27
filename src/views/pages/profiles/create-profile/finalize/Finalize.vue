<template>
  <div class="finish-sec scroll" @keyup.enter="submit">
    <img src="@/views/resources/img/success.png" />
    <span class="set-title"> {{ $t('creation_successful') }}</span>
    <div class="finish-col">
      <div class="finish-left">
        <p class="text1">
          {{ $t('safe_storage_tips') }}
        </p>
        <p class="text">· {{ $t('save_backups') }}</p>
        <p class="text">· {{ $t('don_not_share_mnemonics_with_anyone') }}</p>
        <p class="text">· {{ $t('phishing_warning') }}</p>
        <p class="text">
          ·
          {{ $t('if_you_need_to_back_up_your_mnemonics_again_you_can') }}
        </p>
        <div class="jump-btn">
          <div class="flex-container" style="width: 100%;">
            <button type="button" class="button-style back-button" @click="$router.back()">
              {{ $t('back') }}
            </button>
            <button type="submit" class="button-style validation-button" @click="submit">
              {{ $t('next') }}
            </button>
          </div>
        </div>
      </div>
      <div class="finish-right">
        <!-- <img src="@/views/resources/img/finish.png" alt> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import FinalizeTs from './FinalizeTs'
export default class Finalize extends FinalizeTs {}
</script>
<style lang="less" scoped>
@import './Finalize.less';
</style>
