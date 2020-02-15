<template>
  <div class="transaction-list-outer-container">
    <div class="transaction-list-inner-container">
      <div class="transaction-list-tabs-container">
        <Tabs
          v-model="currentTab" size="small" :active-key="currentTab"
          class="transaction-list-tabs"
          @input="onTabChange"
        >
          <TabPane
            :label="$t('transactions')"
            :tab="'confirmed'"
            :name="'confirmed'"
            class="transaction-tab-inner-container"
            @input="currentTab = 'confirmed'"
          >
            <PageTitle :title="$t('transactions')" @refresh="refresh('confirmed')" />

            <!-- Confirmed transactions tab -->
            <TransactionTable :transactions="currentPageTransactions" @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('unconfirmed')"
            :tab="'unconfirmed'"
            :name="'unconfirmed'"
            @input="currentTab = 'unconfirmed'"
          >
            <PageTitle :title="$t('unconfirmed')" @refresh="refresh('unconfirmed')" />

            <!-- Unconfirmed transactions tab -->
            <TransactionTable :transactions="unconfirmedTransactions" @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('partial')"
            :tab="'partial'"
            :name="'partial'"
            @input="currentTab = 'partial'"
          >
            <PageTitle :title="$t('partial')" @refresh="refresh('partial')" />

            <!-- Partial transactions tab -->
            <TransactionTable :transactions="partialTransactions" @click="onClickTransaction" />
          </TabPane>
        </Tabs>
      </div>

      <div class="transaction-list-pagination-container">
        <span>{{ $t('total_transactions') }}：{{ currentPageTransactions.length }}</span>
        <Page
          :total="currentPageTransactions.length"
          class="page_content"
          @on-change="onPageChange"
        />
      </div>
    </div>

    <ModalTransactionDetails
      v-if="hasDetailModal"
      :visible="hasDetailModal"
      @close="onCloseDetailModal"
      :transaction="activeTransaction"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListTs } from './TransactionListTs'
import './TransactionList.less'

export default class TransactionList extends TransactionListTs {}
</script>
