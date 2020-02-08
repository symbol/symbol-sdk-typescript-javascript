<template>
  <FormWrapper class="account-unlock-container">
    <form
      action="processSubmit"
      onsubmit="event.preventDefault()"
      class="form-line-container mt-3"
      @keyup.enter="processVerification"
    >
      <div class="inline-container">
        <ValidationProvider
          v-slot="{ errors }"
          class="full-width-item-container"
          tag="div"
          mode="lazy"
          vid="password"
          :name="$t('password')"
          :rules="validationRules.accountPassword"
        >
          <ErrorTooltip :errors="errors">
            <input
              v-model="formItems.password"
              v-focus
              type="password"
              class="full-width-item-container input-size input-style"
              :placeholder="$t('please_enter_your_wallet_password')"
            >
          </ErrorTooltip>
        </ValidationProvider>
        <button
          class="button-style validation-button right-side-button"
          type="submit"
          @click="processVerification"
        >
          {{ $t('confirm') }}
        </button>
      </div>
    </form>
  </FormWrapper>
</template>

<script lang="ts">
import {FormAccountUnlockTs} from './FormAccountUnlockTs'
export default class FormAccountUnlock extends FormAccountUnlockTs {}
</script>

<style>
.account-unlock-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>
