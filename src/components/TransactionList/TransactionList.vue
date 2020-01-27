<template>
  <div class="transaction-list-container radius">
    <div class="bottom_transactions radius scroll">

      <Tabs v-model="currentTab" size="small">
        <TabPane :label="$t('transactions')"
                 name="confirmedTransactions"
                 @input="currentTab = 'confirmed'; refresh()">
          <PageTitle :title="$t('transactions')" @refresh="refresh()" />
        </TabPane>
        <TabPane :label="$t('unconfirmed')"
                 name="unconfirmedTransactions"
                 @input="currentTab = 'unconfirmed'; refresh()">
          <PageTitle :title="$t('unconfirmed')" @refresh="refresh()" />
        </TabPane>
        <TabPane :label="$t('partial')"
                 name="partialTransactions"
                 @input="currentTab = 'partial'; refresh()">
          <PageTitle :title="$t('partial')" @refresh="refresh()" />
        </TabPane>
      </Tabs>

      <div class="table_container">
        <div class="all_transaction">

          <TransactionListHeader />

          <!-- Confirmed transactions tab -->
          <TransactionRows v-if="currentTab === 'confirmed'"
                           :transactions="currentPageTransactions"
                           @click="onClickTransaction" />

          <!-- Partial transactions tab -->
          <TransactionRows v-if="currentTab === 'partial'" 
                           :transactions="partialTransactions"
                           @click="onClickTransaction" />

          <!-- Unconfirmed transactions tab -->
          <TransactionRows v-if="currentTab === 'unconfirmed'"
                           :transactions="unconfirmedTransactions"
                           @click="onClickTransaction" />
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
