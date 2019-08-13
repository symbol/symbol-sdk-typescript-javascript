<template>
  <div class="lock_content">
    <ul>
      <li>
        {{$t('old_password')}}
        <div class="gray_content">
          <input class="absolute" type="password" v-model="prePassword" @input="changeBtnState"
                 :placeholder="$t('please_enter_the_original_password')">
        </div>
      </li>
      <li>
        {{$t('set_password')}}
        <div class="tips">
          {{$t('this_password_is_used_to_lock_the_desktop_wallet_Once_lost_you_will_lose_the_right_to_enter_the_desktop_wallet')}}
        </div>
        <div class="gray_content">
          <input class="absolute" type="password" v-model="newPassword"
                 :placeholder="$t('please_enter_a_new_password')">
        </div>
      </li>
      <li>
        {{$t('confirm_password')}}
        <div class="gray_content">
          <input class="absolute" type="password" v-model="repeatPassword"
                 :placeholder="$t('please_enter_your_new_password_again')">
        </div>
        <span :class="[btnState?'sure_button':'confirm_button']" @click="confirmUpdate">{{$t('confirm')}}</span>

      </li>

    </ul>


  </div>
</template>

<script lang="ts">
    import {SettingLockTs} from './SettingLockTs'

    export default class SettingLock extends SettingLockTs {

    }

</script>
<style scoped lang="less">
  @import "SettingLock.less";
</style>
