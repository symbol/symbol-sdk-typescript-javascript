<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
      <form
        onsubmit="event.preventDefault()"
        class="form-container mt-3"
      >
        <SignerSelector v-model="formItems.signerPublicKey" :signers="signers" @input="onChangeSigner" />

        <FormRow>
          <template v-slot:label>
            {{ $t('form_label_registration_type') }}:
          </template>
          <template v-slot:inputs>
            <div class="inputs-container select-container">
              <Select
                v-model="formItems.registrationType"
                class="select-size select-style"
              >
                <Option :value="typeRootNamespace">
                  {{ $t('option_root_namespace') }}
                </Option>
                <Option
                  v-if="ownedNamespaces.length"
                  :value="typeSubNamespace"
                >
                  {{ $t('option_sub_namespace') }}
                </Option>
              </Select>
            </div>
          </template>
        </FormRow>

        <NamespaceSelector
          v-if="formItems.registrationType === typeSubNamespace && ownedNamespaces.length"
          v-model="formItems.parentNamespaceName"
          label="form_label_parent_namespace"
          :namespaces="fertileNamespaces"
        />

        <NamespaceNameInput
          v-model="formItems.newNamespaceName"
          :namespace-registration-type="formItems.registrationType"
        />

        <DurationInput
          v-if="formItems.registrationType === typeRootNamespace"
          v-model="formItems.duration"
          target-asset="namespace"
        />

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
import {FormNamespaceRegistrationTransactionTs} from './FormNamespaceRegistrationTransactionTs'
export default class FormNamespaceRegistrationTransaction extends FormNamespaceRegistrationTransactionTs {}
</script>
