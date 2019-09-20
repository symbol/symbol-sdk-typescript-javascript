<template>
  <div class="text_container" @keyup.enter="submit">
    <Modal
            v-model="isShowClearCache"
            title=""
            class="clear_cache_panel"
            :transfer="true"
    >
      <div class="title">{{$t('clear_cache')}}</div>
      <img src="@/common/img/login/loginWarningIcon.png" alt="">
      <div class="tip">
        {{$t('We_will_clear_your_cache_reset_account_password_please_make_sure_your_wallet_is_safely_backed_up')}}
      </div>
      <div class="confirm">{{$t('confirm')}}</div>
    </Modal>

    <div class="top">
      <img src="@/common/img/login/loginNewLogo.png" alt="">
    </div>

    <div class="middle_text">
      {{$t('WELCOME_TO_CATAPULT_NANO_WALLET')}}
    </div>

    <div class="bottom_text">
      {{$t('This_is_a_distributed_desktop_wallet_based_on_catapult_come_and_explore_the_wonderful_journey_of_catapult')}}
    </div>

    <form @submit.prevent="validateForm('input-lock')">

      <Select v-model="formItem.currentAccountName"
              class="select_wallet">
        <Option v-for="walletName in accountList" :value="walletName.value" :key="walletName.value">{{
          walletName.label}}
        </Option>
      </Select>


      <div class="bottom_input">
        <input
                data-vv-name="password"
                v-model="formItem.password"
                type="password"
                :placeholder="$t('account_password')"
                v-validate="passwordFieldValidation"
        >
        <input
                data-vv-name="cipher"
                v-model="cipher"
                v-validate=''
                style="display:none"
        >
        <img @click="submit" src="@/common/img/login/loginClickToIn.png" alt="">
      </div>
    </form>

    <div class="password_prompt_text">
      <span v-if="isShowPrompt"> {{$t('password_prompt')}}：{{cipherHint}}</span>
    </div>

    <div class="password_prompt">
      {{$t('forget_password')}}？ <span @click="showPrompt" class="pointer click_to_show_prompt">{{$t('password_prompt')}}</span>
      <!--      <span class="clear_cache pointer" v-show="isShowPrompt">{{$t('clear_cache')}}</span>-->
    </div>

  </div>
</template>

<script lang="ts">
    import {InputLockTs} from '@/views/login/login/login-view/input-lock/InputLockTs.ts'
    import "./InputLock.less"

    export default class InputLock extends InputLockTs {
    }
</script>
<style scoped lang="less">
</style>
