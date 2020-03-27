<template>
  <FormWrapper>
    <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
      <form
        onsubmit="event.preventDefault()"
        class="form-container"
      >
        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_namespace_name') }}:
          </template>
          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ namespaceId.fullName }}
              </span>
            </div>
          </template>
        </FormRow>

        <DurationInput
          v-if="formItems.registrationType === typeRootNamespace"
          v-model="formItems.duration"
          target-asset="namespace"
          label="form_label_additional_duration"
        />

        <FormRow>
          <template v-slot:label>
            {{ currentExpirationInfoView.expired ? $t('Expired_for') : $t('Expires_in') }}:
          </template>
          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ currentExpirationInfoView.expiration }}
                ({{ $t('at_block', {blockNumber: currentNamespaceEndHeight}) }})
              </span>
            </div>
          </template>
        </FormRow>

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_new_expiration_time') }}:
          </template>
          <template v-slot:inputs>
            <ValidationProvider
              v-slot="{ validate, errors }"
              vid="newDuration"
              :name="$t('form_label_new_expiration_time')"
              :rules="validationRules.namespaceDuration"
              :immediate="true"
              slim
            >
              <input v-show="false" v-model="newDuration" @change="validate">
              <ErrorTooltip :errors="errors">
                <div class="row-left-message">
                  <span :class="[ errors.length ? 'red' : '', 'pl-2' ]">
                    {{ newExpirationInfoView }} ({{ $t('at_block', {blockNumber: newEndHeight}) }})
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
import { FormExtendNamespaceDurationTransactionTs } from './FormExtendNamespaceDurationTransactionTs'
export default class FormExtendNamespaceDurationTransaction extends FormExtendNamespaceDurationTransactionTs {}
</script>
