<template>
  <div class="transaction_modal">
    <Modal
      v-if="activeTransaction"
      v-model="show"
      :title="$t('transaction_details')"
      :transfer="false"
      class-name="transaction-modal-dialog text_select"
    >
      <TransactionDetails :transaction="activeTransaction" />
    </Modal>
  </div>
</template>

<script lang="ts">
import {TransactionModalTs} from '@/components/transaction-modal/TransactionModalTs.ts'
import './TransactionModal.less'

export default class TransactionModal extends TransactionModalTs {

}
</script>

<style scoped lang="less">
</style>
