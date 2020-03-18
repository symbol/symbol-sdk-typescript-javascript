<template>
  <div>
    <FormWrapper class="general-settings-container" :whitelisted="true">
      <ValidationObserver ref="observer" v-slot="{ handleSubmit }">
        <form
          class="form-container mt-3"
          onsubmit="event.preventDefault()"
          autocomplete="off"
        >
          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_language') }}:
            </template>
            <template v-slot:inputs>
              <div class="inputs-container select-container">
                <LanguageSelector
                  v-model="formItems.currentLanguage"
                  :auto-submit="false"
                  :default-form-style="true"
                />
              </div>
            </template>
          </FormRow>

          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_default_max_fee') }}:
            </template>
            <template v-slot:inputs>
              <div class="inputs-container select-container">
                <MaxFeeSelector v-model="formItems.maxFee" />
              </div>
            </template>
          </FormRow>

          <ExplorerUrlSetter
            v-model="formItems.explorerUrl"
            :auto-submit="false"
          />


          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_default_wallet') }}:
            </template>
            <template v-slot:inputs>
              <div class="inputs-container select-container">
                <WalletSelectorField
                  v-model="formItems.defaultWallet"
                  :default-form-style="true"
                />
              </div>
            </template>
          </FormRow>

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
  flex-flow: row-reverse;

  button[type="reset"] {
    margin-right: 35px;
  }
}
</style>

