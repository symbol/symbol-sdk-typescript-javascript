<template>
  <div class="table_body hide_scroll" @scroll="divScroll">
    <slot name="empty">
      <div v-if="!transactions.length" class="no_data">
        {{ $t('no_confirmed_transactions') }}
      </div>
    </slot>

    <slot name="body">
      <div
        v-for="(transaction, index) in transactions"
        :key="index"
        class="table_item pointer "
      >
        <TransactionRow :transaction="transaction"
                        @click="$emit('click', transaction)" />
      </div>
    </slot>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {TransactionRowsTs} from './TransactionRowsTs'

export default class TransactionRows extends TransactionRowsTs {}
</script>
