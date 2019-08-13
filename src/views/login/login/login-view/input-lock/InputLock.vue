<template>
  <div class="text_container" @keyup.enter="jumpToDashBoard()">
    <Modal
            v-model="isShowClearCache"
            title=""
            class="clear_cache_panel"
            :transfer="true">

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

    <div class="bottom_input">
      <input type="password" :placeholder="$t('lock_password')" v-model="form.password">
      <img @click="jumpToDashBoard" src="@/common/img/login/loginJump.png" alt="">
    </div>

    <div class="password_prompt_text">
      <span v-if="isShowPrompt"> {{$t('passowrd_prompt')}}：{{lockPromptText}}</span>
    </div>

    <div class="password_prompt">
      {{$t('forget_password')}}？<span @click="showPrompt"
                                      class="pointer click_to_show_prompt">{{$t('passowrd_prompt')}}</span>
      <span class="clear_cache pointer"
            v-show="isShowPrompt">{{$t('clear_cache')}}</span>
    </div>

  </div>
</template>

<script lang="ts">
    import "./InputLock.less"
    import {InputLockTs} from './InputLockTs'

    export default class InputLock extends InputLockTs {

    }
</script>
<style scoped lang="less">

</style>
