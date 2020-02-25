<template>
  <FormWrapper>
    <ValidationObserver v-slot="{ handleSubmit }" slim>
      <form
        onsubmit="event.preventDefault()"
        @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
      >
        <!-- Display of account to be converted -->
        <FormRow v-if="multisigOperationType === 'conversion'">
          <template v-slot:label>
            {{ $t('form_label_account_to_be_converted') }}
          </template>
          <template v-slot:inputs>
            <div class="row-left-message">
              <span class="pl-2">
                {{ currentWallet.objects.address.pretty() }} ({{ currentWallet.values.get('name') }})
              </span>
            </div>
          </template>
        </FormRow>

        <!-- Transaction signer selector -->
        <div v-if="multisigOperationType === 'modification'" class="form-line-container">
          <SignerSelector 
            v-model="formItems.signerPublicKey"
            :signers="multisigs"
            :label="$t('form_label_multisig_accounts')"
            @change="onChangeSigner"
          />
        </div>
        
        <!-- Min. approval input field -->
        <ApprovalAndRemovalInput
          v-model="formItems.minApprovalDelta"
          :multisig-operation-type="multisigOperationType"
          approval-or-removal="approval"
          :current-multisig-info="currentSignerMultisigInfo"
          :new-number-of-cosignatories="newNumberOfCosignatories"
        />

        <!-- Min. removal input field -->
        <ApprovalAndRemovalInput
          v-model="formItems.minRemovalDelta"
          :multisig-operation-type="multisigOperationType"
          approval-or-removal="removal"
          :current-multisig-info="currentSignerMultisigInfo"
          :new-number-of-cosignatories="newNumberOfCosignatories"
        />

        <!-- Add cosignatory input field -->
        <AddCosignatoryInput
          @on-add-cosignatory="onAddCosignatory"
        />

        <!-- Remove cosignatory input field -->
        <RemoveCosignatoryInput
          v-if="currentSignerMultisigInfo && currentSignerMultisigInfo.cosignatories.length"
          :cosignatories="currentSignerMultisigInfo.cosignatories"
          @on-remove-cosignatory="onRemoveCosignatory"
        />

        <!-- Display of cosignatory modifications -->
        <CosignatoryModificationsDisplay
          v-if="Object.keys(formItems.cosignatoryModifications).length"
          :cosignatory-modifications="formItems.cosignatoryModifications"
          @on-remove-cosignatory-modification="onRemoveCosignatoryModification"
        />

        <!-- Displays and validates the future situation -->
        <ApprovalAndRemovalInputDisplay
          :new-number-of-cosignatories="newNumberOfCosignatories"
          :new-min-approval="newMinApproval"
          :new-min-removal="newMinRemoval"
        />

        <!-- Transaction fee selector -->
        <MaxFeeAndSubmit
          v-model="formItems.maxFee"
          :disable-submit="disableSubmit"
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
// internal dependencies
import { FormMultisigAccountModificationTransactionTs } from './FormMultisigAccountModificationTransactionTs'

export default class FormMultisigAccountModificationTransaction extends FormMultisigAccountModificationTransactionTs {}
</script>
