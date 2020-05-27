<template>
  <div class="transaction-list-outer-container">
    <div class="transaction-list-inner-container">
      <div class="transaction-list-tabs-container">
        <TransactionListFilters />
        <TransactionTable
          :transactions="getCurrentPageTransactions()"
          :empty-message="getEmptyMessage()"
          @click="onClickTransaction"
        />
      </div>
      <div class="transaction-list-pagination-container">
        <Page :total="totalCountItems" class="page_content" @on-change="onPageChange" />
      </div>
    </div>

    <ModalTransactionDetails
      v-if="hasDetailModal"
      :visible="hasDetailModal"
      :transaction="activeTransaction"
      @close="onCloseDetailModal"
    />

    <ModalTransactionCosignature
      v-if="hasCosignatureModal"
      :visible="hasCosignatureModal"
      :transaction="activePartialTransaction"
      @close="onCloseCosignatureModal"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListTs } from './TransactionListTs'
export default class TransactionList extends TransactionListTs {}
</script>
<style lang="less" scoped>
@import './TransactionList.less';
</style>
