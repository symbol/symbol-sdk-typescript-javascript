<template>
  <div>
    <FormWrapper class="general-settings-container">
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          class="form-container mt-3"
          onsubmit="event.preventDefault()"
          @keyup.enter="handleSubmit(onSubmit)"
          autocomplete="off"
        >
          <div class="form-row">
            <FormLabel>{{ $t('form_label_language') }}</FormLabel>
            <LanguageSelector
              v-model="formItems.language"
              :auto-submit="false"
              :default-form-style="true" />
          </div>

          <!-- Transaction fee selector -->
          <MaxFeeSelector v-model="formItems.maxFee" :class-name="'form-row'" />

          <div class="form-row">
            <ExplorerUrlSetter
              v-model="formItems.explorerUrl"
              :auto-submit="false" />
          </div>

          <div class="form-row">
            <FormLabel>{{ $t('form_label_default_wallet') }}</FormLabel>
            <WalletSelectorField
              v-model="formItems.defaultWallet"
              :auto-submit="false"
              :default-form-style="true" />
          </div>

          <div class="form-row form-submit">
            <button
              class="button-style validation-button right-side-button"
              type="submit"
              @click="handleSubmit(onSubmit)"
            >
              {{ $t('confirm') }}
            </button>
            <button
              class="button-style validation-button back-button"
              type="reset"
              @click="resetForm"
            >
              {{ $t('reset') }}
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
import { FormGeneralSettingsTs } from './FormGeneralSettingsTs'
export default class FormGeneralSettings extends FormGeneralSettingsTs {}
</script>

<style lang="less" scoped>
.general-settings-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}

.form-submit {
  display: flex;
  margin-top: 25px;

  button[type="reset"] {
    margin-left: 35px;
  }
}
</style>

