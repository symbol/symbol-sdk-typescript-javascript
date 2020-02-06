<template>
  <div class="transaction_modal">
    <Modal
      v-if="visible && !!transaction"
      v-model="visible"
      :title="$t('transaction_details')"
      :transfer="false"
      class-name="transaction-modal-dialog text_select"
    >
      <TransactionDetails :transaction="transaction" />
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionDetailsTs} from './ModalTransactionDetailsTs'
import './ModalTransactionDetails.less'

export default class ModalTransactionDetails extends ModalTransactionDetailsTs {}
</script>
