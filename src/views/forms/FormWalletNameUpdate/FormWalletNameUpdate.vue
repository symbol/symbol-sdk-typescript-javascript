<template>
  <FormWrapper class="wallet-name-update-container" :whitelisted="true">
    <ValidationObserver
      v-slot="{ handleSubmit }"
      ref="observer"
      class="wallet-name-update-container"
      slim
    >
      <form
        class="form-line-container mt-3"
        onsubmit="event.preventDefault()"
      >
        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_wallet_name') }}:
          </template>
          <template v-slot:inputs>
            <div class="row-75-25 inputs-container">
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="name"
                :name="$t('name')"
                :rules="validationRules.accountWalletName"
                slim
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.name"
                    v-focus
                    type="text"
                    name="name"
                    class="input-size input-style"
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
          </template>
        </FormRow>
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

