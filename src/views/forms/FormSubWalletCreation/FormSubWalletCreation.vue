<template>
  <div>
    <FormWrapper class="sub-wallet-creation-container">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          class="form-container mt-3"
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
          autocomplete="off"
        >
          <div class="form-row">
            <ValidationProvider
              tag="div" mode="lazy" vid="name"
              :name="$t('type')"
              :rules="'required'"
              v-slot="{ errors }"
            >
              <FormLabel>{{ $t('form_label_new_wallet_type') }}</FormLabel>
              <select v-model="formItems.type"
                      class="input-size input-style">
                <option>{{ $t('please_select') }}</option>
                <option value="child_wallet">{{ $t('option_child_wallet') }}</option>
                <option value="privatekey_wallet">{{ $t('option_privatekey_wallet') }}</option>
              </select>
            </ValidationProvider>
          </div>

          <div class="form-row">
            <ValidationProvider
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
                      class="input-size input-style"
                      v-model="formItems.name"
                      autocomplete="new-password" />
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-row">
            <ValidationProvider v-if="formItems.type === 'privatekey_wallet'"
              tag="div"
              mode="lazy"
              vid="name"
              :name="$t('privateKey')"
              :rules="validationRules.privateKey"
              v-slot="{ errors }"
            >
              <FormLabel>{{ $t('form_label_private_key') }}</FormLabel>
              <ErrorTooltip :errors="errors">
                <input type="password"
                      name="privateKey"
                      class="input-size input-style"
                      v-model="formItems.privateKey"
                      autocomplete="new-password" />
              </ErrorTooltip>
            </ValidationProvider>
          </div>

          <div class="form-row">
            <button
              class="button-style validation-button left-side-button"
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
import { FormSubWalletCreationTs } from './FormSubWalletCreationTs'
export default class FormSubWalletCreation extends FormSubWalletCreationTs {}
</script>

<style scope>
.sub-wallet-creation-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>

