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
import {TransactionModalTs} from '@/components/TransactionModal/TransactionModalTs.ts'
import './TransactionModal.less'

export default class TransactionModal extends TransactionModalTs {}
</script>
