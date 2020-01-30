<template>
  <div class="table_container">
    <div class="all_transaction">

      <TransactionListHeader />

      <div class="table_body hide_scroll">
        <div
          v-if="!!transactions"
          v-for="(transaction, index) in transactions"
          :key="index"
          class="table_item pointer "
        >
          <TransactionRow :transaction="transaction"
                          @click="$emit('click', transaction)" />
        </div>

        <div v-if="!transactions || !transactions.length" class="no_data">
          {{ $t('no_confirmed_transactions') }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {TransactionRowsTs} from './TransactionRowsTs'
import './TransactionRows.less'

export default class TransactionRows extends TransactionRowsTs {}
</script>
