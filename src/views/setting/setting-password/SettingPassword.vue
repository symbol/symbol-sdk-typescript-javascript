<template>
  <form @submit.prevent="validateForm('setting-lock')" @keyup.enter="submit">
    <div class="lock_content secondary_page_animate">
      <ul>
        <li>
          <FormInput fieldName="previousPassword" :formModel="formItems"/>
        </li>
        <li>
          <FormInput fieldName="newPassword" :formModel="formItems"/>
        </li>
        <li>
          <FormInput fieldName="confirmPassword" :formModel="formItems"/>
        </li>
        <li>
          <FormInput fieldName="hint" :formModel="formItems"/>
        </li>
        <FormInput style="display:none" fieldName="cipher" :formModel="formItems"/>
      </ul>
      <span :class="`submit-button${submitDisabled ? ' submit-button-disabled' : ''}`"
            @click="submit">{{$t('confirm')}}</span>
    </div>
  </form>
</template>

<script lang="ts">
    import {SettingPasswordTs} from '@/views/setting/setting-password/SettingPasswordTs.ts'

    export default class SettingLock extends SettingPasswordTs {
    }
</script>
<style scoped lang="less">
  @import "./SettingPassword.less";
</style>
