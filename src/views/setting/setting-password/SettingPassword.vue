<template>
  <form @submit.prevent="validateForm('setting-lock')" @keyup.enter="submit">
    <div class="lock_content secondary_page_animate">
      <ul>
        <li>
          <FormInput
            field-name="previousPassword"
            :form-model="formItems"
            hint="HINT_previous_password"
            label="password"
            :validation="validation.previousPassword"
            field-type="password"
            placeholder="PLACEHOLDER_previous_password"
          />
        </li>

        <li>
          <FormInput
            field-name="newPassword"
            :form-model="formItems"
            label="LABEL_new_password"
            field-type="password"
            :validation="validation.password"
            hint1="HINT_new_password1"
            hint2="HINT_new_password2"
            placeholder="PLACEHOLDER_new_password"
          />
        </li>
        <li>
          <FormInput
            field-name="confirmPassword"
            :form-model="formItems"
            label="PLACEHOLDER_confirm_password"
            field-type="password"
            placeholder="PLACEHOLDER_confirm_password"
            :validation="validation.confirmPassword"
          />
        </li>
        <li>
          <FormInput
            field-name="hint"
            :form-model="formItems"
            label="hint"
            hint1="HINT_cipher_hint1"
            hint2="HINT_new_password2"
            placeholder="PLACEHOLDER_cipher_hint"
          />
        </li>
        <FormInput style="display:none" field-name="cipher" :form-model="formItems" />
      </ul>
      <span
        :class="`submit-button${submitDisabled ? ' submit-button-disabled' : ''}`"
        @click="submit"
      >{{ $t('confirm') }}</span>
    </div>
  </form>
</template>

<script lang="ts">
import { SettingPasswordTs } from '@/views/setting/setting-password/SettingPasswordTs.ts'

export default class SettingLock extends SettingPasswordTs {}
</script>
<style scoped lang="less">
@import "./SettingPassword.less";
</style>
