<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="handleSubmit(onSubmit)"
      >
        <SignerSelector v-model="formItems.signerPublicKey" />
      
        <NamespaceSelector
          v-if="namespaceRegistrationType === NamespaceRegistrationType.SubNamespace"
          v-model="formItems.parentNamespaceName"
          :namespace-registration-type="namespaceRegistrationType"
        />

        <NamespaceNameInput
          v-model="formItems.newNamespaceName"
          :namespace-registration-type="namespaceRegistrationType"
        />

        <DurationInput
          v-if="namespaceRegistrationType === NamespaceRegistrationType.RootNamespace"
          v-model="formItems.duration"
          target-asset="namespace"
        />

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
  </FormWrapper>
</template>

<script lang="ts">
// @ts-ignore
import {FormNamespaceRegistrationTransactionTs} from './FormNamespaceRegistrationTransactionTs'
export default class FormNamespaceRegistrationTransaction extends FormNamespaceRegistrationTransactionTs {}
</script>
