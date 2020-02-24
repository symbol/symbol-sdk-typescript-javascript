<template>
  <div class="container">
    <Modal
      v-model="show"
      class-name="modal-transaction-confirmation"
      :title="$t('modal_title_transaction_confirmation')"
      :transfer="false"
      @close="show = false"
    >
      <div class="transactionConfirmationBody">
        <div class="stepItem1">
          <div v-if="!!stagedTransactions"
               v-for="(transaction, index) in stagedTransactions"
               class="info_container">
            <TransactionDetails :transaction="transaction" />
          </div>

          <HardwareConfirmationButton 
            v-if="isUsingHardwareWallet" 
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

      <div slot="footer" class="modal-footer"></div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionConfirmationTs} from './ModalTransactionConfirmationTs'
export default class ModalTransactionConfirmation extends ModalTransactionConfirmationTs {}
</script>

<style lang="less">
.modal-transaction-confirmation {
  min-width: 8.5rem;
  max-width: 12rem;
  margin: 0 auto;
  overflow: hidden;
  .ivu-modal {
    width: 12rem !important;
  }
  
  .ivu-modal-content {
    width: 100%;
  }
}

.modal-footer {
  height: 0.46rem;
  padding-right: 0.4rem;
}

.float-right {
  float: right;
}
</style>
