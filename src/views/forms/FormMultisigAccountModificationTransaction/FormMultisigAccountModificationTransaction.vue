<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
      >
        <!-- Display of account to be converted -->
        <div v-if="multisigOperationType === 'conversion'" class="form-line-container">
          <FormLabel>{{ $t('form_label_account_to_be_converted') }}</FormLabel>
          {{ currentWallet.objects.address.pretty() }} ({{ currentWallet.values.get('name') }})
        </div>

        <!-- Transaction signer selector -->
        <div v-if="multisigOperationType === 'modification'" class="form-line-container">
          <SignerSelector v-model="formItems.signerPublicKey"
                          :signers="signers.slice(1)"
                          :label="$t('form_label_multisig_accounts')"
                          @input="onChangeSigner" />
        </div>

        <!-- Min. approval and min. removal input fields -->
        <ApprovalAndRemovalInputDisplay
          :new-number-of-cosignatories="newNumberOfCosignatories"
          :new-min-approval="newMinApproval"
          :new-min-removal="newMinRemoval"
        >
          <ApprovalAndRemovalInput
            v-model="formItems.minApprovalDelta"
            :multisig-operation-type="multisigOperationType"
            approval-or-removal="approval"
            :current-multisig-info="currentMultisigInfo"
            :new-number-of-cosignatories="newNumberOfCosignatories"
          />
          <ApprovalAndRemovalInput
            v-model="formItems.minRemovalDelta"
            :multisig-operation-type="multisigOperationType"
            approval-or-removal="removal"
            :current-multisig-info="currentMultisigInfo"
            :new-number-of-cosignatories="newNumberOfCosignatories"
          />
        </ApprovalAndRemovalInputDisplay>

        <!-- Add cosignatory input field -->
        <AddCosignatoryInput
          @on-add-cosignatory="onAddCosignatory"
        />

        <!-- Remove cosignatory input field -->
        <RemoveCosignatoryInput
          v-if="currentMultisigInfo && currentMultisigInfo.cosignatories.length"
          :cosignatories="currentMultisigInfo.cosignatories"
          @on-remove-cosignatory="onRemoveCosignatory"
        />

        <!-- Display of cosignatory modifications -->
        <CosignatoryModificationsDisplay
          :cosignatory-modifications="formItems.cosignatoryModifications"
          @on-remove-cosignatory-modification="onRemoveCosignatoryModification"
        />

        <!-- Transaction fee selector -->
        <MaxFeeSelector v-model="formItems.maxFee" />

        <div v-if="!disableSubmit" class="form-line-container fixed-full-width-item-container">
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
      @close="onConfirmationCancel"
    />
  </FormWrapper>
</template>

<script lang="ts">
// internal dependencies
import { FormMultisigAccountModificationTransactionTs } from './FormMultisigAccountModificationTransactionTs'

export default class FormMultisigAccountModificationTransaction extends FormMultisigAccountModificationTransactionTs {}
</script>
