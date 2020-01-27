<template>
  <div class="transaction-list-container radius">
    <div class="bottom_transactions radius scroll">

      <PageTitle :title="$t('transactions')" @refresh="refresh()" />

      <div class="table_container">
        <div class="all_transaction">

          <TransactionListHeader />

          <TransactionListRows :transactions="partialTransactions" @clicked="onClickTransaction" />
          <TransactionListRows :transactions="unconfirmedTransactions" @clicked="onClickTransaction" />
          <TransactionListRows :transactions="currentPageTransactions" @clicked="onClickTransaction" />
        </div>
      </div>

      <div class="split_page">
        <span>{{ $t('total_transactions') }}：{{ transactionList.length }}</span>
        <Page :total="transactionList.length" class="page_content" @on-change="changePage" />
      </div>
    </div>

    <TransactionModal
      :visible="!!activeTransaction"
      :transaction="activeTransaction"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {TransactionListTs} from './TransactionListTs'
import './TransactionList.less'

export default class TransactionList extends TransactionListTs {}
</script>
