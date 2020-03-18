<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
      <form onsubmit="event.preventDefault()">
        <FormRow :class-name="'emphasis'">
          <template v-slot:label>
            {{ $t('form_label_multisig_operation_type') }}
          </template>

          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ $t('label_multisig_operation_' + multisigOperationType) }}
              </span>
            </div>
          </template>
        </FormRow>

        <FormRow>
          <template v-slot:label>
            <div v-if="multisigOperationType === 'conversion'">
              {{ $t('form_label_account_to_be_converted') }}
            </div>
            <div v-else>
              {{ $t('form_label_multisig_account') }}:
            </div>
          </template>
          <template v-slot:inputs>
            <SignerSelector
              v-model="formItems.signerPublicKey"
              :signers="signers"
              :no-label="true"
              @input="onChangeSigner"
            />
          </template>
        </FormRow>

        <FormRow
          v-if="multisigOperationType === 'modification' && currentMultisigInfo"
          :class-name="'emphasis'"
        >
          <template v-slot:label>
            {{ $t('form_label_multisig_current_info') }}
          </template>

          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ $t('label_of', {
                  min: currentMultisigInfo.minApproval,
                  max: currentMultisigInfo.cosignatories.length
                }) }} {{ $t('label_for_approvals') }}
              </span>
              <span class="pl-2">
                {{ $t('label_of', {
                  min: currentMultisigInfo.minRemoval,
                  max: currentMultisigInfo.cosignatories.length
                }) }} {{ $t('label_for_removals') }}
              </span>
            </div>
          </template>
        </FormRow>

        <MultisigCosignatoriesDisplay
          :multisig="currentMultisigInfo"
          :cosignatory-modifications="formItems.cosignatoryModifications"
          :modifiable="true"
          @remove="onClickRemove"
          @add="onClickAdd"
          @undo="onClickUndo"
        />

        <ApprovalAndRemovalInput
          v-model="formItems.minApprovalDelta"
          :type="'approval'"
          :operation="multisigOperationType"
          :multisig="currentMultisigInfo"
        />

        <ApprovalAndRemovalInput
          v-model="formItems.minRemovalDelta"
          :type="'removal'"
          :operation="multisigOperationType"
          :multisig="currentMultisigInfo"
        />

        <!-- global form input validation -->
        <ValidationProvider rules="required|is:OK">
          <input v-show="false" v-model="areInputsValid">
        </ValidationProvider>

        <!-- Transaction fee selector -->
        <MaxFeeAndSubmit
          v-model="formItems.maxFee"
          :disable-submit="disableSubmit"
          @button-clicked="disableSubmit ? '' : handleSubmit(onSubmit); showErrorNotification()"
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
// internal dependencies
import { FormMultisigAccountModificationTransactionTs } from './FormMultisigAccountModificationTransactionTs'

export default class FormMultisigAccountModificationTransaction extends FormMultisigAccountModificationTransactionTs {}
</script>
