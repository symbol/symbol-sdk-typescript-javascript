<template>
  <div>
    <FormWrapper class="wallet-name-update-container">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          class="form-line-container mt-3"
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
        >
          <div class="inline-container">
            <ValidationProvider
              class="full-width-item-container"
              tag="div"
              mode="lazy"
              vid="name"
              :name="$t('name')"
              :rules="validationRules.accountWalletName"
              v-slot="{ errors }"
            >
              <FormLabel>{{ $t('form_label_new_wallet_name') }}</FormLabel>
              <ErrorTooltip :errors="errors">
                <input type="text"
                      name="name"
                      class="full-width-item-container input-size input-style"
                      v-model="formItems.name"
                      v-focus />
              </ErrorTooltip>
            </ValidationProvider>

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
import { FormWalletNameUpdateTs } from './FormWalletNameUpdateTs'
export default class FormWalletNameUpdate extends FormWalletNameUpdateTs {}
</script>

<style scope>
.wallet-name-update-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>

