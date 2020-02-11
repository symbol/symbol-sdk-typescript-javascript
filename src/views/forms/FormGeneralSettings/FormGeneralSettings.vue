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
          <MaxFeeSelector v-model="formItems.maxFee" />

          <div class="form-row">
            <ExplorerUrlSetter
              v-model="formItems.explorerUrl"
              :auto-submit="false" />
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
import { FormGeneralSettingsTs } from './FormGeneralSettingsTs'
export default class FormGeneralSettings extends FormGeneralSettingsTs {}
</script>

<style scoped>
.general-settings-container {
  display: block;
  width: 100%;
  clear: both;
  min-height: 1rem;
}
</style>

