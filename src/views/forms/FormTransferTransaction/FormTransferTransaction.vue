<template>
  <div class="FormTransferTransaction">
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
        <form onsubmit="event.preventDefault()">
          <!-- Transaction signer selector -->
          <SignerSelector 
            v-if="!hideSigner"
            v-model="formItems.signerPublicKey"
            :signers="signers"
            @input="onChangeSigner"
          />

          <!-- Transfer recipient input field --> 
          <RecipientInput v-model="formItems.recipientRaw" @input="onChangeRecipient" />

          <!-- Mosaics attachments input fields -->
          <div v-for="(attachedMosaic, index) in formItems.attachedMosaics" :key="index">
            <MosaicAttachmentInput
              v-if="attachedMosaic.uid"
              :mosaic-attachment="attachedMosaic"
              :mosaic-hex-ids="mosaicInputsManager.getMosaicsBySlot(attachedMosaic.uid)"
              :absolute="false"
              :uid="attachedMosaic.uid"
              :is-show-delete="index > 0 && index === formItems.attachedMosaics.length - 1"
              :is-first-item="index === 0"
              @input-changed="onMosaicInputChange"
              @input-deleted="onDeleteMosaicInput"
            />
          </div>

          <!-- Add mosaic button -->
          <div class="form-row align-right action-link">
            <a v-if="mosaicInputsManager.hasFreeSlots()" @click="addMosaicAttachmentInput">{{ $t('add_mosaic') }}</a>
          </div>

          <!-- Transfer message input field -->
          <MessageInput v-model="formItems.messagePlain" @input="onChangeMessage" />

          <!-- Transaction fee selector and submit button -->
          <MaxFeeAndSubmit
            v-model="formItems.maxFee"
            :disable-submit="disableSubmit"
            @button-clicked="handleSubmit(onSubmit)"
            @input="onChangeMaxFee"
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

    <!-- force mosaic list reactivity -->
    <div v-show="false">
      {{ currentMosaicList() }}
    </div>
  </div>
</template>

<script lang="ts">
import { FormTransferTransactionTs } from './FormTransferTransactionTs'
export default class FormTransferTransaction extends FormTransferTransactionTs {}
</script>
