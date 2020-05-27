<template>
  <div class="transaction_modal">
    <Modal v-model="show" :title="$t('modal_title_transaction_details')" :transfer="false" @close="show = false">
      <TransactionDetails :transaction="transaction" />
    </Modal>
  </div>
</template>

<script lang="ts">
import { ModalTransactionDetailsTs } from './ModalTransactionDetailsTs'
export default class ModalTransactionDetails extends ModalTransactionDetailsTs {}
</script>
<style lang="less" scoped>
@import './ModalTransactionDetails.less';
</style>
