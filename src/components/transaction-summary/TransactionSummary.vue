<template>
    <div class="transaction_preview">
      <div class="dash_board_dialog text_select scroll">
        <TransactionDetails
          :transaction="formattedTransaction"
          @innerTransactionClicked = "innerTransactionClicked"
        />  
      </div>

        <Modal
            v-if="currentInnerTransaction"
            :title="$t('transaction_detail')"
            v-model="isShowInnerDialog"
            class-name="dash_board_dialog inner_dialog scroll"
            :transfer="false"
        >
            <TransactionDetails :transaction="currentInnerTransaction" />
        </Modal>
    </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionSummaryTs} from '@/components/transaction-summary/TransactionSummaryTs.ts'

    export default class TransactionSummary extends TransactionSummaryTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionSummary.less";
</style>
