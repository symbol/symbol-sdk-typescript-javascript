<template>
  <div>
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
        >
          <ValidationProvider
            class="full-width-item-container"
            tag="div" mode="lazy" vid="name"
            :name="$t('type')"
            :rules="'required'"
            v-slot="{ errors }"
          >
            <div class="row">
              <FormLabel>{{ $t('form_label_new_wallet_type') }}</FormLabel>
              <select v-model="formItems.type"
                      class="full-width-item-container input-size select-style">
                <option>{{ $t('please_select') }}</option>
                <option value="child_wallet">{{ $t('child_wallet') }}</option>
                <option value="privatekey_wallet">{{ $t('privatekey_wallet') }}</option>
              </select>
            </div>
          </ValidationProvider>

          <ValidationProvider
            class="full-width-item-container"
            tag="div"
            mode="lazy"
            vid="name"
            :name="$t('name')"
            :rules="validationRules.accountWalletName"
            v-slot="{ errors }"
          >
            <div class="row">
              <FormLabel>{{ $t('form_label_new_wallet_name') }}</FormLabel>
              <ErrorTooltip :errors="errors">
                <input type="text"
                      name="name"
                      class="full-width-item-container input-size input-style"
                      v-model="formItems.name" />
              </ErrorTooltip>
            </div>
          </ValidationProvider>

          <ValidationProvider v-if="formItems.type === 'privatekey_wallet'"
            class="full-width-item-container"
            tag="div"
            mode="lazy"
            vid="name"
            :name="$t('privateKey')"
            :rules="validationRules.privateKey"
            v-slot="{ errors }"
          >
            <div class="row">
              <FormLabel>{{ $t('form_label_private_key') }}</FormLabel>
              <ErrorTooltip :errors="errors">
                <input type="password"
                      name="privateKey"
                      class="full-width-item-container input-size input-style"
                      v-model="formItems.privateKey" />
              </ErrorTooltip>
            </div>
          </ValidationProvider>

          <button
            class="button-style validation-button right-side-button"
            type="submit"
            @click="handleSubmit(onSubmit)"
          >
            {{ $t('confirm') }}
          </button>
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
