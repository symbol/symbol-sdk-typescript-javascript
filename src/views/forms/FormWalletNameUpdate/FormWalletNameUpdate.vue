<template>
  <div>
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }" class="wallet-name-update-container">
        <form
          class="form-line-container mt-3"
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
        >
          <FormLabel>{{ $t('form_label_new_wallet_name') }}</FormLabel>
          <div class="inline-container">
            <ValidationProvider
              v-slot="{ errors }"
              class="full-width-item-container"
              tag="div"
              mode="lazy"
              vid="name"
              :name="$t('name')"
              :rules="validationRules.accountWalletName"
            >
              <ErrorTooltip :errors="errors">
                <input
                  v-model="formItems.name"
                  v-focus
                  type="text"
                  name="name"
                  class="full-width-item-container input-size input-style"
                >
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
  min-height: 1.4rem;
}
</style>

