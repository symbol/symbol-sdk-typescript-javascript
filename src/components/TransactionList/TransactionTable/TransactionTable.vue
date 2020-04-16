<template>
  <div class="transaction-table-container">
    <TransactionListHeader />
    <Spin
      v-if="isFetchingTransactions" size="large" fix
      class="absolute"
    />
    <div v-if="transactions.length" class="transaction-rows-outer-container">
      <div class="transaction-rows-inner-container">
        <TransactionRow
          v-for="transaction in transactionsList"
          :key="transaction.transactionInfo.hash"
          :transaction="transaction"
          :is-partial="getTransactionStatus(transaction) === 'partial'"
          @click="$emit('click', transaction)"
        />
      </div>
    </div>
    <div v-if=" !transactions.length && !isFetchingTransactions" class="no-data-outer-container">
      <div class="no-data-message-container">
        <div>{{ $t(emptyMessage) }}</div>
      </div>
      <div class="no-data-inner-container">
        <div v-for="item in nodata" :key="item">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {TransactionTableTs} from './TransactionTableTs'
export default class TransactionTable extends TransactionTableTs{}
</script>

<style lang="less">
@import "./TransactionTable.less";
</style>
