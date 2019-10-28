<template>
  <div class="transaction_modal">
    <Modal
            v-model="show"
            v-if="activeTransaction"
            :title="$t('transaction_detail')"
            :transfer="false"
            class-name="dash_board_dialog text_select"
    >
      <TransactionSummary
        :formattedTransaction="activeTransaction"
        :add-scroll="true"
      />
    </Modal>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionModalTs} from '@/components/transaction-modal/TransactionModalTs.ts'

    export default class TransactionModal extends TransactionModalTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionModal.less";
</style>
