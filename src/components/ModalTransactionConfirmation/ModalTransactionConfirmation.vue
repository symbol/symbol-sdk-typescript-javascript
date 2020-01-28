<template>
  <div class="transactionConfirmationWrap">
    <Modal
      v-if="visible && stagedTransactions.length"
      :title="$t('transaction_details')"
      class-name="vertical-center-modal"
      :footer-hide="true"
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

          <HardwareConfirmationButton v-if="isUsingHardwareWallet()" @success="onTransactionsSigned" />
          <FormAccountUnlock v-else @success="onAccountUnlocked" />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionConfirmationTs} from '@/components/transaction-confirmation/ModalTransactionConfirmationTs.ts'
import './ModalTransactionConfirmation.less'

export default class ModalTransactionConfirmation extends ModalTransactionConfirmationTs {}
</script>
