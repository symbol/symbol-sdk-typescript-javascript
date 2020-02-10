<template>
  <div class="transactionConfirmationWrap">
    <Modal
      v-if="show"
      :title="$t('modal_title_transaction_confirmation')"
      :transfer="false"
    >
      <div slot="header" class="transactionConfirmationHeader">
        <span class="title">{{ $t('confirm_information') }}</span>
      </div>
      <div class="transactionConfirmationBody">
        <div class="stepItem1">
          <div v-for="(transaction, index) in stagedTransactions"
               class="info_container">
            <TransactionDetails :transaction="transaction" />
          </div>

          <HardwareConfirmationButton 
            v-if="isUsingHardwareWallet()" 
            @success="onTransactionsSigned"
            @error="onError"
          />
          <FormAccountUnlock 
            v-else
            @success="onAccountUnlocked"
            @error="onError"
          />
        </div>
      </div>

      <div slot="footer" class="modal-footer">
        <button
          type="submit"
          class="centered-button button-style back-button float-right"
          @click="show = false"
        >
          {{ $t('close') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionConfirmationTs} from './ModalTransactionConfirmationTs'
import './ModalTransactionConfirmation.less'

export default class ModalTransactionConfirmation extends ModalTransactionConfirmationTs {}
</script>
