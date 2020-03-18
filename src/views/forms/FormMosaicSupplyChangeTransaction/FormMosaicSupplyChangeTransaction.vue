<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
      <form
        onsubmit="event.preventDefault()"
        class="form-container"
      >
        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_supply_direction') }}:
          </template>
          <template v-slot:inputs>
            <div class="inputs-container select-container">
              <Select
                v-model="formItems.action"
                class="select-size select-style"
              >
                <Option :value="MosaicSupplyChangeAction.Increase">
                  {{ $t('increase') }}
                </Option>
                <Option :value="MosaicSupplyChangeAction.Decrease">
                  {{ $t('decrease') }}
                </Option>
              </Select>
            </div>
          </template>
        </FormRow>

        <SupplyInput v-model="formItems.delta" label="form_label_supply_delta" />

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_current_supply') }}:
          </template>
          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ $t('relative') }}: {{ currentMosaicRelativeSupply }} ({{ $t('absolute') }}:
                {{ currentMosaicInfo.supply.compact().toLocaleString() }})
              </span>
            </div>
          </template>
        </FormRow>

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_supply') }}:
          </template>
          <template v-slot:inputs>
            <ValidationProvider
              v-slot="{ validate, errors }"
              vid="newDuration"
              :name="$t('form_label_new_absolute_supply')"
              :rules="validationRules.supply"
              :immediate="true"
              slim
            >
              <input v-show="false" v-model="newMosaicAbsoluteSupply" @change="validate">
              <ErrorTooltip :errors="errors">
                <div class="input-size row-left-message">
                  <span :class="[ 'pl-2', errors.length ? 'red' : '' ]">
                    {{ $t('relative') }}: {{ newMosaicRelativeSupply || '' }} ({{ $t('absolute') }}:
                    {{ newMosaicAbsoluteSupply && newMosaicAbsoluteSupply.toLocaleString() }})
                  </span>
                </div>
              </ErrorTooltip>
            </ValidationProvider>
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
import {FormMosaicSupplyChangeTransactionTs} from './FormMosaicSupplyChangeTransactionTs'
export default class FormMosaicSupplyChangeTransaction extends FormMosaicSupplyChangeTransactionTs {}
</script>
