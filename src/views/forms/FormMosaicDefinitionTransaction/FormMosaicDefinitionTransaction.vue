<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="handleSubmit(onSubmit)"
      >
        <SignerSelector v-model="formItems.signerPublicKey" />

        <SupplyInput v-model="formItems.supply" />

        <DivisibilityInput v-model="formItems.divisibility" />

        <DurationInput
          v-show="!formItems.permanent"
          v-model="formItems.duration"
          target-asset="namespace"
        />

        <div class="form-line-container fixed-full-width-item-container checkboxes">
          <Checkbox v-model="formItems.transferable">
            {{ $t('transmittable') }}
          </Checkbox>
          <Checkbox v-model="formItems.supplyMutable">
            {{ $t('variable_supply') }}
          </Checkbox>
          <Checkbox v-model="formItems.permanent">
            {{ $t('duration_permanent') }}
          </Checkbox>
          <Checkbox v-model="formItems.restrictable">
            {{ $t('restrictable') }}
          </Checkbox>
        </div>

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <div class="form-line-container fixed-full-width-item-container mt-3">
          <button
            type="submit"
            class="centered-button button-style validation-button"
            @click="handleSubmit(onSubmit)"
          >
            {{ $t('send') }}
          </button>
        </div>
      </form>
    </ValidationObserver>

    <ModalTransactionConfirmation
      v-if="hasConfirmationModal"
      :visible="hasConfirmationModal"
      @success="onConfirmationSuccess"
      @error="onConfirmationError"
    />
  </FormWrapper>
</template>

<script lang="ts">
// @ts-ignore
import {FormMosaicDefinitionTransactionTs} from './FormMosaicDefinitionTransactionTs'
export default class FormMosaicDefinitionTransaction extends FormMosaicDefinitionTransactionTs {}
</script>

<style lang="less" scoped>
.checkboxes {
  margin: 0.25rem 0 0.3rem 0;
}
</style>
