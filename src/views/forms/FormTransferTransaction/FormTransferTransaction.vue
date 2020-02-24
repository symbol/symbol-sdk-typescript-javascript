<template>
  <div class="FormTransferTransaction">
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }" slim>
        <form
          onsubmit="event.preventDefault()"
          @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
        >
          <!-- Transaction signer selector -->
          <SignerSelector v-if="!hideSigner"
                          v-model="formItems.signerPublicKey"
                          :signers="signers"
                          @change="onChangeSigner" />

          <!-- Transfer recipient input field -->
          <RecipientInput v-model="formItems.recipientRaw" />

          <!-- Mosaics attachments input fields -->
          <MosaicAttachmentInput
            v-model="formItems.attachedMosaics"
            :mosaics="currentWalletMosaics"
            :absolute="false"
            @add="onAddMosaic"
          />

          <!-- Display of attached mosaics -->
          <MosaicAttachmentDisplay
            v-model="formItems.attachedMosaics"
            :absolute="false"
            @delete="onDeleteMosaic"
          />

          <!-- Transfer message input field -->
          <MessageInput v-model="formItems.messagePlain" />

          <!-- Transaction fee selector and submit button -->
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
  </div>
</template>

<script lang="ts">
import { FormTransferTransactionTs } from './FormTransferTransactionTs'
export default class FormTransferTransaction extends FormTransferTransactionTs {}
</script>
