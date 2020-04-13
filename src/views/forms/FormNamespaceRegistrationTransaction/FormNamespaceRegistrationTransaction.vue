<template>
  <div>
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form onsubmit="event.preventDefault()" class="form-container mt-3 create-namespace-form">
          <SignerSelector
            v-model="formItems.signerPublicKey"
            :signers="signers"
            @input="onChangeSigner"
          />
          <FormRow>
            <template v-slot:label>
              {{ $t('form_label_registration_type') }}:
            </template>
            <template v-slot:inputs>
              <div class="inputs-container">
                <div
                  v-if="$route.path.substring(1) === 'createNamespace'"
                  :value="typeRootNamespace"
                  class="display-value"
                >
                  {{ $t('option_root_namespace') }}
                </div>
                <div
                  v-if="$route.path.substring(1) === 'createSubNamespace' && ownedNamespaces.length"
                  :value="typeSubNamespace"
                  class="display-value"
                >
                  {{ $t('option_sub_namespace') }}
                </div>
              </div>
            </template>
          </FormRow>
          <NamespaceSelector
            v-if="formItems.registrationType === typeSubNamespace && ownedNamespaces.length"
            :value="formItems.parentNamespaceName"
            label="form_label_parent_namespace"
            :namespaces="fertileNamespaces"
            @input="setParentNamespaceName"
          />

          <NamespaceNameInput
            v-model="formItems.newNamespaceName"
            :is-need-auto-focus="false"
            :namespace-registration-type="formItems.registrationType"
          />
          <FormRow v-if="formItems.registrationType === typeSubNamespace">
            <template v-slot:label>
              {{ $t('current_validity') }}:
            </template>
            <template v-slot:inputs>
              <div class="inputs-container">
                <div class="display-value">
                  {{ relativeTimetoParent }}
                </div>
              </div>
            </template>
          </FormRow>

          <DurationInput
            v-if="formItems.registrationType === typeRootNamespace"
            v-model="formItems.duration"
            target-asset="namespace"
            :show-relative-time="true"
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
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { FormNamespaceRegistrationTransactionTs } from './FormNamespaceRegistrationTransactionTs'
export default class FormNamespaceRegistrationTransaction extends FormNamespaceRegistrationTransactionTs { }
</script>
<style lang="less" scoped>
  @import "./FormNamespaceRegistrationTransaction.less";
</style>
