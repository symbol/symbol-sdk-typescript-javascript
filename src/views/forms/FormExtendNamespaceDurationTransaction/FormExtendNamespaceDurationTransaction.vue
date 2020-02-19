<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        class="form-container mt-3"
        @keyup.enter="handleSubmit(onSubmit)"
      >
        <div class="form-row">
          <FormLabel>{{ $t('form_label_namespace_name') }}</FormLabel>
          <span class="description-text">
            {{ namespaceId.fullName }}
          </span>
        </div>

        <DurationInput
          v-if="formItems.registrationType === typeRootNamespace"
          v-model="formItems.duration"
          target-asset="namespace-renewal"
          label="form_label_additional_duration"
        />

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <div class="form-row">
          <FormLabel>{{ currentExpirationInfoView.expired ? $t('Expired_for') : $t('Expires_in') }}</FormLabel>
          {{ currentExpirationInfoView.expiration }} ({{ $t('at_block', {blockNumber: currentNamespaceEndHeight}) }})
        </div>
        <div class="form-row">
          <FormLabel>{{ $t('form_label_new_expiration_time') }}</FormLabel>
          <ValidationProvider
            v-slot="{ validate, errors }"
            vid="newDuration"
            :name="$t('form_label_new_expiration_time')"
            class="new-status-display-container mx-1"
            :rules="validationRules.namespaceDuration"
            :immediate="true"
            tag="div"
          >
            <input v-show="false" v-model="newDuration" @change="validate">
            <ErrorTooltip :errors="errors">
              <div class="full-width-item-container">
                <span :class="[ 'description-text', errors.length ? 'red' : '' ]">
                  {{ newExpirationInfoView }} ({{ $t('at_block', {blockNumber: newEndHeight}) }})
                </span>
              </div>
            </ErrorTooltip>
          </ValidationProvider>
        </div>

        <button 
          type="submit"
          class="centered-button button-style validation-button"
          @click="handleSubmit(onSubmit)"
        >
          {{ $t('send') }}
        </button>
      </form>
    </ValidationObserver>
  </FormWrapper>
</template>

<script lang="ts">
// @ts-ignore
import { FormExtendNamespaceDurationTransactionTs } from './FormExtendNamespaceDurationTransactionTs'
export default class FormExtendNamespaceDurationTransaction extends FormExtendNamespaceDurationTransactionTs {}
</script>
