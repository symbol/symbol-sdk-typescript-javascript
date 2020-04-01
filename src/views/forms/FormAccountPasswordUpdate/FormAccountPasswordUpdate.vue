<template>
  <FormWrapper class="password-settings-container" :whitelisted="true">
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
      <form
        class="form-container mt-3"
        onsubmit="event.preventDefault()"
        autocomplete="off"
      >
        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_password') }}:
          </template>
          <template v-slot:inputs>
            <ValidationProvider
              v-slot="{ errors }"
              vid="newPassword"
              mode="lazy"
              :name="$t('password')"
              :rules="validationRules.password"
              tag="div"
              class="inputs-container items-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  ref="passwordInput"
                  v-model="formItems.password"
                  class="input-size input-style"
                  :placeholder="$t('form_label_new_password')"
                  type="password"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </template>
        </FormRow>
 

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_password_confirm') }}:
          </template>
          <template v-slot:inputs>
            <ValidationProvider
              v-slot="{ errors }"
              mode="lazy"
              vid="confirmPassword"
              :name="$t('confirmPassword')"
              :rules="validationRules.confirmPassword"
              tag="div"
              class="inputs-container items-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  ref="passwordInput"
                  v-model="formItems.passwordConfirm"
                  class="input-size input-style"
                  :placeholder="$t('form_label_new_password_confirm')"
                  type="password"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </template>
        </FormRow>

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_password_hint') }}:
          </template>
          <template v-slot:inputs>
            <ValidationProvider
              v-slot="{ errors }"
              vid="hint"
              :name="$t('hint')"
              :rules="validationRules.message"
              tag="div"
              class="inputs-container items-container"
            >
              <ErrorTooltip :errors="errors">
                <input
                  v-model="formItems.passwordHint"
                  class="input-size input-style"
                  :placeholder="$t('form_label_new_password_hint')"
                >
              </ErrorTooltip>
            </ValidationProvider>
          </template>
        </FormRow>

        <div class="form-row text-right">
          <button
            class="button-style validation-button right-side-button"
            type="submit"
            @click="handleSubmit(onSubmit)"
          >
            {{ $t('confirm') }}
          </button>
        </div>
      </form>
    </ValidationObserver>
    <ModalFormAccountUnlock
      v-if="hasAccountUnlockModal"
      :visible="hasAccountUnlockModal"
      :on-success="onAccountUnlocked"
      @close="hasAccountUnlockModal = false"
    />
  </FormWrapper>
</template>

<script lang="ts">
import { FormAccountPasswordUpdateTs } from './FormAccountPasswordUpdateTs'
export default class FormAccountPasswordUpdate extends FormAccountPasswordUpdateTs {}
</script>

<style scoped>
.password-settings-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
.text-right{
  text-align: right;
}
</style>

