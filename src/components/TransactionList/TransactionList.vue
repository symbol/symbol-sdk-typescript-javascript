<template>
  <div class="transaction-list-container radius">
    <div class="bottom_transactions radius scroll">

      <Tabs v-model="currentTab" size="small" @input="onTabChange">
        <TabPane :label="$t('transactions')" 
                 :tab="'confirmed'"
                 name="confirmedTransactions"
                 @input="currentTab = 'confirmed'">
          <PageTitle :title="$t('transactions')" @refresh="refresh('confirmed')" />

          <!-- Confirmed transactions tab -->
          <TransactionRows v-if="currentTab === 'confirmed'"
                           :transactions="currentPageTransactions"
                           @click="onClickTransaction" />
        </TabPane>
        <TabPane :label="$t('unconfirmed')"
                 :tab="'unconfirmed'"
                 name="unconfirmedTransactions"
                 @input="currentTab = 'unconfirmed'">
          <PageTitle :title="$t('unconfirmed')" @refresh="refresh('unconfirmed')" />

          <!-- Unconfirmed transactions tab -->
          <TransactionRows v-if="currentTab === 'unconfirmed'"
                           :transactions="unconfirmedTransactions"
                           @click="onClickTransaction" />
        </TabPane>
        <TabPane :label="$t('partial')"
                 :tab="'partial'"
                 name="partialTransactions"
                 @input="currentTab = 'partial'">
          <PageTitle :title="$t('partial')" @refresh="refresh('partial')" />

          <!-- Partial transactions tab -->
          <TransactionRows v-if="currentTab === 'partial'" 
                           :transactions="partialTransactions"
                           @click="onClickTransaction" />
        </TabPane>
      </Tabs>

      <div class="split_page">
        <span>{{ $t('total_transactions') }}：{{ currentPageTransactions.length }}</span>
        <Page :total="currentPageTransactions.length" class="page_content" @on-change="onPageChange" />
      </div>
    </div>

    <ModalTransactionDetails
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
