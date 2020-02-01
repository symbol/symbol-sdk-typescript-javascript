<template>
  <div class="FormTransferCreation">
    <form action="onSubmit" onsubmit="event.preventDefaul" @keyup.enter="onSubmit">

      <!-- Transaction signer selector -->
      <SignerSelector v-model="formItems.signerPublicKey" />

      <!-- Transfer recipient input field -->
      <RecipientInput v-model="formItems.recipientRaw" @input="onChangeRecipient" />

      <!-- Mosaics attachments input fields -->
      <MosaicAttachmentInput v-model="formItems.attachedMosaics"
                             :mosaics="currentWalletMosaics"
                             :absolute="false"
                             @add="onAddMosaic" />

      <!-- Display of attached mosaics -->
      <MosaicAttachmentDisplay v-model="formItems.attachedMosaics"
                               :absolute="true"
                               @delete="onDeleteMosaic" />

      <!-- Transfer message input field -->
      <MessageInput v-model="formItems.messagePlain" />

      <!-- Transaction fee selector -->
      <MaxFeeSelector v-model="formItems.maxFee" />

      <div class="send_button pointer" @click="onSubmit">
        {{ $t('send') }}
      </div>
    </form>

    <ModalTransactionConfirmation :visible="isAwaitingSignature === true"
                                  @success="onConfirmationSuccess"
                                  @error="onConfirmationError" />
  </div>
</template>

<script lang="ts">
import { FormTransferCreationTs } from '@/views/forms/FormTransferCreation/FormTransferCreationTs.ts'
import "./FormTransferCreation.less";

export default class FormTransferCreation extends FormTransferCreationTs {}
</script>
