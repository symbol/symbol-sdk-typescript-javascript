<template>
  <form @submit.prevent="validateForm('setting-lock')">
    <div class="lock_content secondary_page_animate">
      <ul>
        <li>
          <FormInput fieldName="previousPassword" :formModel="formModel"/>
        </li>
        <li>
          <FormInput fieldName="newPassword" :formModel="formModel"/>
        </li>
        <li>
          <FormInput fieldName="confirmPassword" :formModel="formModel"/>
        </li>
        <li>
          <FormInput fieldName="hint" :formModel="formModel"/>
        </li>
        <FormInput style="display:none" fieldName="cipher" :formModel="formModel"/>
      </ul>
      <span :class="`submit-button${submitDisabled ? ' submit-button-disabled' : ''}`"
            @click="submit">{{$t('confirm')}}</span>
    </div>
  </form>
</template>

<script lang="ts">
    import {SettingLockTs} from '@/views/setting/setting-lock/SettingLockTs.ts'

    export default class SettingLock extends SettingLockTs {
    }
</script>
<style scoped lang="less">
  @import "SettingLock.less";
</style>
