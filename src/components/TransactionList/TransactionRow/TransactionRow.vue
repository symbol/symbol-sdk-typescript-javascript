<template>
  <div class="transaction-row-container transaction-table-columns"
       @click="$emit('click', transaction)">
    <!-- FIRST COLUMN -->
    <div class="icon-cell">
      <img :src="getIcon()" class="icon-cell-image">
    </div>

    <!-- SECOND COLUMN -->
    <div class="address-cell">
      <AddressDisplay :address="transaction.signer.address" />
      <ActionDisplay :transaction="transaction" />
    </div>

    <!-- THIRD COLUMN -->
    <div class="amount-cell">
      <!-- Display details if transfer -->
      <div v-if="transaction.type === transactionType.TRANSFER">
        <div v-if="transaction.mosaics.length">
          <MosaicAmountDisplay
            :id="transaction.mosaics[0].id"
            :absolute-amount="transaction.mosaics[0].amount.compact()"
            :color="isIncomingTransaction() ? 'green' : 'red'"
          />
        </div>
      </div>

      <!-- Display fee if not transfer -->
      <div v-else>
        <MosaicAmountDisplay :id="networkMosaic" :amount="getFeeAmount()" :color="'red'" />
      </div>
    </div>

    <!-- FOURTH COLUMN -->
    <div class="confirmation-cell">
      {{ getHeight() }}
    </div>

    <!-- FIFTH COLUMN -->
    <div class="hash-cell">
      <span class="hash-cell-transaction-hash">
        <a
          class="url_text"
          target="_blank"
          :href="(explorerBaseUrl + '/transaction/' + transaction.transactionInfo.hash)"
        >{{ formatters.miniHash(transaction.transactionInfo.hash) }}</a>
      </span>
      <span class="hash-cell-time">
        <!-- @TODO: Should be transaction time instead of deadline -->
        {{ timeHelpers.formatTimestamp(transaction.deadline.value) }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionRowTs } from './TransactionRowTs'

export default class TransactionRow extends TransactionRowTs {}
</script>
