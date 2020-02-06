<template>
  <div class="FormTransferCreation">
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }">
        <form
          onsubmit="event.preventDefault()"
          @keyup.enter="disableSubmit ? '' : handleSubmit(onSubmit)"
        >
          <!-- Transaction signer selector -->
          <SignerSelector v-if="!hideSigner" v-model="formItems.signerPublicKey" />

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
        :visible="isAwaitingSignature === true"
        @success="onConfirmationSuccess"
        @error="onConfirmationError"
      />
    </FormWrapper>
  </div>
</template>

<script lang="ts">
import { FormTransferCreationTs } from '@/views/forms/FormTransferCreation/FormTransferCreationTs.ts'
import '@/styles/forms.less'
export default class FormTransferCreation extends FormTransferCreationTs {}
</script>
