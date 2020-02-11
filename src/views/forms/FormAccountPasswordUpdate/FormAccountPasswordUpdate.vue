<template>
  <div>
    <FormWrapper class="password-settings-container">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          class="form-container mt-3"
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
          autocomplete="off"
        >
          <div class="form-row">
            <FormLabel>{{ $t('form_label_new_password') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="newPassword"
              mode="lazy"
              :name="$t('password')"
              :rules="validationRules.password"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    ref="passwordInput"
                    v-model="formItems.password"
                    class="full-width-item-container input-size input-style"
                    :placeholder="$t('form_label_new_password')"
                    type="password"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-row">
            <FormLabel>{{ $t('form_label_new_password_confirm') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="confirmPassword"
              :name="$t('confirmPassword')"
              :rules="validationRules.confirmPassword"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    v-model="formItems.passwordConfirm"
                    class="full-width-item-container input-size input-style"
                    data-vv-name="confirmPassword"
                    :placeholder="$t('form_label_new_password_confirm')"
                    type="password"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-row">
            <FormLabel>{{ $t('form_label_new_password_hint') }}</FormLabel>
            <ValidationProvider
              v-slot="{ errors }"
              vid="hint"
              :name="$t('hint')"
              :rules="validationRules.message"
              tag="div"
              class="inline-container"
            >
              <ErrorTooltip :errors="errors">
                <div class="full-width-item-container">
                  <input
                    v-model="formItems.passwordHint"
                    class="full-width-item-container input-size input-style"
                    :placeholder="$t('form_label_new_password_hint')"
                  >
                </div>
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-row">
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
    </FormWrapper>

    <ModalFormAccountUnlock
      v-if="hasAccountUnlockModal"
      :visible="hasAccountUnlockModal"
      :on-success="onAccountUnlocked"
      @close="hasAccountUnlockModal = false"
    />
  </div>
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
</style>

