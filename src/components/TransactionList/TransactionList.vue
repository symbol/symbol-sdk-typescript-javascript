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
            :icon="''"
            class="transaction-tab-inner-container"
            @input="currentTab = 'confirmed'"
          >

            <!-- Confirmed transactions tab -->
            <TransactionTable :transactions="currentPageTransactions.items"
                              :empty-message="'no_confirmed_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('transactions_tab_unconfirmed')"
            :tab="'unconfirmed'"
            :name="'unconfirmed'"
            :icon="''"
            @input="currentTab = 'unconfirmed'"
          >

            <!-- Unconfirmed transactions tab -->
            <TransactionTable :transactions="currentUnconfirmedTransactions.items"
                              :empty-message="'no_unconfirmed_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
          <TabPane
            :label="$t('transactions_tab_partial')"
            :tab="'partial'"
            :name="'partial'"
            :icon="''"
            @input="currentTab = 'partial'"
          >

            <!-- Partial transactions tab -->
            <TransactionTable :transactions="currentPartialTransactions.items"
                              :empty-message="'no_partial_transactions'"
                              @click="onClickTransaction" />
          </TabPane>
        </Tabs>
      </div>

      <div class="transaction-list-pagination-container">
        <!-- <span>{{ $t('total_transactions') }}：{{ totalCountItems }}</span> -->
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

    <ModalTransactionCosignature
      v-if="hasCosignatureModal"
      :visible="hasCosignatureModal"
      @close="onCloseCosignatureModal"
      :transaction="activePartialTransaction"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListTs } from './TransactionListTs'
import './TransactionList.less'

export default class TransactionList extends TransactionListTs {}
</script>
