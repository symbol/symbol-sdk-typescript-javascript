<template>
  <div class="createLockWrap scroll">
    <img class="close pointer" @click="hideIndexView" src="@/common/img/login/loginClose.png" alt="">
    <div class="pageTit">{{$t('CREATE_LOCK_PASSWORD')}}</div>
    <div class="pageRemind">{{$t('Locking_passwords_as_a_form_of_program_protection')}}</div>

    <div class="formDiv">
      <ul>
        <li class="first-item">
          <div class="gray_content">
            <input v-model="lockPW.password" type="password"
                   :placeholder="$t('Set_the_password')">
            <img src="@/common/img/login/loginLock.png" alt="">

          </div>
          <div class="tips">
            {{$t('password_hint', {min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH, specialChar:
            ALLOWED_SPECIAL_CHAR})}}
          </div>
        </li>
        <li>

          <div class="gray_content">
            <input type="password" v-model="lockPW.checkPW"
                   :placeholder="$t('Confirm_the_password')">
          </div>
        </li>
        <li>
          <div class="gray_content">
            <input type="text" v-model="lockPW.remindTxt"
                   :placeholder="$t('Set_the_password_prompts')">
            <img src="@/common/img/login/loginBell.png" alt="">
          </div>
        </li>
      </ul>
    </div>
    <div class="buttonDiv clear">
      <button @click="showIndexView" class="pointer">CREATE</button>
    </div>
  </div>
</template>

<script lang="ts">
    import {CreateLockTs} from './CreateLockTs'

    export default class InputLock extends CreateLockTs {

    }
</script>

<style scoped lang="less">
  @import "CreateLock.less";
</style>

