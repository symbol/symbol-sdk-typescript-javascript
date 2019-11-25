<template>
  <form @submit.prevent="validateForm('setting-lock')" @keyup.enter="submit">
    <div class="lock_content secondary_page_animate">
      <ul>
        <li>
          <FormInput
            fieldName="previousPassword"
            :formModel="formItems"
            hint="HINT_previous_password"
            label="password"
            :validation="validation.previousPassword"
            fieldType="password"
            placeholder="PLACEHOLDER_previous_password"
          />
        </li>

        <li>
          <FormInput
            fieldName="newPassword"
            :formModel="formItems"
            label="LABEL_new_password"
            fieldType="password"
            :validation="validation.password"
            hint1="HINT_new_password1"
            hint2="HINT_new_password2"
            placeholder="PLACEHOLDER_new_password"
          />
        </li>
        <li>
          <FormInput
            fieldName="confirmPassword"
            :formModel="formItems"
            label="PLACEHOLDER_confirm_password"
            fieldType="password"
            placeholder="PLACEHOLDER_confirm_password"
            :validation="validation.confirmPassword"
          />
        </li>
        <li>
          <FormInput
            fieldName="hint"
            :formModel="formItems"
            label="hint"
            hint1="HINT_cipher_hint1"
            hint2="HINT_new_password2"
            placeholder="PLACEHOLDER_cipher_hint"
          />
        </li>
        <FormInput style="display:none" fieldName="cipher" :formModel="formItems" />
      </ul>
      <span
        :class="`submit-button${submitDisabled ? ' submit-button-disabled' : ''}`"
        @click="submit"
      >{{$t('confirm')}}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { SettingPasswordTs } from "@/views/setting/setting-password/SettingPasswordTs.ts";

export default class SettingLock extends SettingPasswordTs {}
</script>
<style scoped lang="less">
@import "./SettingPassword.less";
</style>
