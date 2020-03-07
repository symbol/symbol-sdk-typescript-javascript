<template>
  <div class="FormTransferTransaction">
    <FormWrapper>
      <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
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
          <div v-for="(attachedMosaic, index) in formItems.attachedMosaics" :key="index">
            <MosaicAttachmentInput
              v-if="attachedMosaic.uid"
              :mosaic-attachment="attachedMosaic"
              :mosaic-hex-ids="mosaicInputsManager.getMosaicsBySlot(attachedMosaic.uid)"
              :absolute="false"
              :uid="attachedMosaic.uid"
              @input-changed="onMosaicInputChange"
              @input-deleted="onDeleteMosaicInput"
            />
          </div>

          <!-- Add mosaic button -->
          <div class="form-row align-right action-link">
            <a v-if="mosaicInputsManager.hasFreeSlots()" @click="addMosaicAttachmentInput">{{ $t('add_mosaic') }}</a>
          </div>

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

    <!-- force mosaic list reactivity -->
    <div v-show="false">{{ currentMosaicList() }}</div>
  </div>
</template>

<script lang="ts">
import { FormTransferTransactionTs } from './FormTransferTransactionTs'
export default class FormTransferTransaction extends FormTransferTransactionTs {}
</script>
