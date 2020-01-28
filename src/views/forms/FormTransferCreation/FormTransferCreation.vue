<template>
  <div class="FormTransferCreation">
    <form @submit.prevent="validateForm('FormTransferCreation-transaction')" @keyup.enter="processTransfer">

      <SignerSelector v-model="formItems.signerPublicKey "/>

      <div class="target flex_center">
        <span class="title">{{ $t('FormTransferCreation_target') }}</span>
        <span class="value radius flex_center">

          <RecipientInput v-model="formItems.recipient" />

        </span>
      </div>

      <MosaicSelector :mosaics="currentWalletMosaics"
                      v-model="formItems.selectedMosaicHex" />

      <AmountInput :mosaic-hex="formItems.selectedMosaicHex"
                    v-model="formItems.relativeAmount" />

      <MosaicAttachmentDisplay :mosaics="formItems.attachedMosaics"
                               @delete="onDeleteMosaic" />

      <div class="remark flex_center">
        <span class="title">{{ $t('message') }}</span>
        <span class="textarea_container flex_center value radius">

          <MessageInput v-model="formItems.messagePlain" />

        </span>
      </div>

      <MaxFeeSelector v-model="formItems.maxFee" />

      <div class="send_button pointer" @click="processTransfer">
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
