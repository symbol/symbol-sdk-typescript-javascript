<template>
  <div class="transaction-list-outer-container">
    <div class="transaction-list-inner-container">
      <div class="transaction-list-tabs-container">
        <Tabs
          v-model="currentTab"
          :active-key="currentTab"
          class="transaction-list-tabs"
          @input="onTabChange"
        >
          <TabPane
            :label="$t('transactions_tab_confirmed')"
            :tab="'confirmed'"
            :name="'confirmed'"
            :icon="'md-checkmark-circle-outline'"
            class="transaction-tab-inner-container"
            @input="currentTab = 'confirmed'"
          >
            <PageTitle :title="$t('transactions')" @refresh="refresh('confirmed')" />

            <!-- Confirmed transactions tab -->
            <TransactionTable :transactions="currentPageTransactions.items"
                              :empty-message="'no_confirmed_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('transactions_tab_unconfirmed')"
            :tab="'unconfirmed'"
            :name="'unconfirmed'"
            :icon="'ios-remove-circle-outline'"
            @input="currentTab = 'unconfirmed'"
          >
            <PageTitle :title="$t('unconfirmed')" @refresh="refresh('unconfirmed')" />

            <!-- Unconfirmed transactions tab -->
            <TransactionTable :transactions="currentUnconfirmedTransactions.items"
                              :empty-message="'no_unconfirmed_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('transactions_tab_partial')"
            :tab="'partial'"
            :name="'partial'"
            :icon="'ios-people-outline'"
            @input="currentTab = 'partial'"
          >
            <PageTitle :title="$t('partial')" @refresh="refresh('partial')" />

            <!-- Partial transactions tab -->
            <TransactionTable :transactions="currentPartialTransactions.items"
                              :empty-message="'no_partial_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
        </Tabs>
      </div>

      <div class="transaction-list-pagination-container">
        <span>{{ $t('total_transactions') }}：{{ totalCountItems }}</span>
        <Page
          :total="totalCountItems"
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
