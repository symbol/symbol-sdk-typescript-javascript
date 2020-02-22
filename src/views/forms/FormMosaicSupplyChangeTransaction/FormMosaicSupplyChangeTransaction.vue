<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="handleSubmit(onSubmit)"
      >
        <div class="form-row">
          <FormLabel>{{ $t('form_label_supply_direction') }}</FormLabel>
          <select
            v-model="formItems.action"
            class="input-size input-style"
          >
            <option :value="MosaicSupplyChangeAction.Increase">
              {{ $t('increase') }}
            </option>
            <option :value="MosaicSupplyChangeAction.Decrease">
              {{ $t('decrease') }}
            </option>
          </select>
        </div>

        <SupplyInput v-model="formItems.delta" label="form_label_supply_delta" />

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <div class="form-row">
          <FormLabel>{{ $t('form_label_current_supply') }}</FormLabel>
          {{ currentMosaicInfo.supply.compact() }}
        </div>

        <div class="form-row">
          <FormLabel>{{ $t('form_label_current_supply') }}</FormLabel>
          <ValidationProvider
            v-slot="{ validate, errors }"
            vid="newDuration"
            :name="$t('form_label_new_expiration_time')"
            class="new-status-display-container mx-1"
            :rules="validationRules.supply"
            :immediate="true"
            tag="div"
          >
            <input v-show="false" v-model="newMosaicAbsoluteSupply" @change="validate">
            <ErrorTooltip :errors="errors">
              <div class="full-width-item-container">
                <span :class="[ 'description-text', errors.length ? 'red' : '' ]">
                  {{ newMosaicRelativeSupply }}
                </span>
              </div>
            </ErrorTooltip>
          </ValidationProvider>
        </div>

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
  </FormWrapper>
</template>

<script lang="ts">
// @ts-ignore
import {FormMosaicSupplyChangeTransactionTs} from './FormMosaicSupplyChangeTransactionTs'
export default class FormMosaicSupplyChangeTransaction extends FormMosaicSupplyChangeTransactionTs {}
</script>
