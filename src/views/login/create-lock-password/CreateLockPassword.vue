<template>
  <div class="createLockWrap scroll">
    <h1 class="pageTit">{{$t('create_a_Lock_password')}}</h1>
    <p class="pageRemind">{{$t('lock_pass_text')}}</p>
    <p class="pageRemind">{{$t('lock_pass_text_2')}}</p>
    <div class="formDiv">
      <ul>
        <li>
          {{$t('new_password')}}
          <div class="gray_content">
            <input class="absolute" v-model="lockPW.password" type="password"
                   :placeholder="$t('please_enter_the_original_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="password" v-model="lockPW.checkPW"
                   :placeholder="$t('please_enter_a_new_password')">
          </div>
        </li>
        <li>
          {{$t('set_password_hint')}}

          <div class="tips">
            {{$t('password_hints_great_help_when_you_forget_your_password')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="text" v-model="lockPW.remindTxt"
                   :placeholder="$t('please_set_a_password_prompt')">
          </div>
        </li>
      </ul>
    </div>
    <div class="buttonDiv clear">
      <Button @click="jumpToOtherPage('/login')" class="prev left">{{$t('return_to_the_welcome_page')}}</Button>
      <Button @click="jumpToOtherPage('/walletPanel')" class="next right">{{$t('next')}}</Button>
    </div>
  </div>
</template>

<script lang="ts">
    import {CreateLockPasswordTs} from './CreateLockPasswordTs'

    export default class CreateLockPassword extends CreateLockPasswordTs {

    }
</script>

<style scoped lang="less">
  @import "./CreateLockPassword.less";
</style>

