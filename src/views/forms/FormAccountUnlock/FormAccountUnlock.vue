<template>
  <FormWrapper class="account-unlock-container" :whitelisted="true">
    <form
      action="processSubmit"
      onsubmit="event.preventDefault()"
      class="form-line-container mt-3"
    >
      <FormRow>
        <template v-slot:label>
          {{ $t('form_label_password') }}:
        </template>
        <template v-slot:inputs>
          <div class="row-75-25 inputs-container">
            <ValidationProvider
              v-slot="{ errors }"
              mode="lazy"
              vid="password"
              :name="$t('password')"
              :rules="validationRules.accountPassword"
              slim
            >
              <ErrorTooltip :errors="errors">
                <input
                  v-model="formItems.password"
                  v-focus
                  type="password"
                  class="input-size input-style"
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
        </template>
      </FormRow>
    </form>
  </FormWrapper>
</template>

<script lang="ts">
import {FormAccountUnlockTs} from './FormAccountUnlockTs'
export default class FormAccountUnlock extends FormAccountUnlockTs {}
</script>

<style scoped>
.account-unlock-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>
