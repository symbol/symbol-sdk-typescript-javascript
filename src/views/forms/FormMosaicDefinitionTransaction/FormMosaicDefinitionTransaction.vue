<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
      <form onsubmit="event.preventDefault()">
        <SignerSelector v-model="formItems.signerPublicKey" :signers="signers" @input="onChangeSigner" />

        <SupplyInput v-model="formItems.supply" />

        <DivisibilityInput v-model="formItems.divisibility" />

        <DurationInput
          v-show="!formItems.permanent"
          v-model="formItems.duration"
          target-asset="mosaic"
        />
        
        <FormRow>
          <template v-slot:inputs>
            <div class="inputs-container checkboxes">
              <Checkbox v-model="formItems.permanent">
                {{ $t('duration_permanent') }}
              </Checkbox>
              <Checkbox v-model="formItems.transferable">
                {{ $t('transmittable') }}
              </Checkbox>
              <Checkbox v-model="formItems.supplyMutable">
                {{ $t('variable_supply') }}
              </Checkbox>
              <Checkbox v-model="formItems.restrictable">
                {{ $t('restrictable') }}
              </Checkbox>
            </div>
          </template>
        </FormRow>

        <MaxFeeAndSubmit
          v-model="formItems.maxFee"
          @button-clicked="handleSubmit(onSubmit)"
        />
      </form>
    </ValidationObserver>

    <ModalTransactionConfirmation
      v-if="hasConfirmationModal"
      :visible="hasConfirmationModal"
      @success="onConfirmationSuccess"
      @error="onConfirmationError"
      @close="onConfirmationCancel"
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
  display: grid;
  grid-auto-flow: column; 
  align-items: baseline;
}
</style>
