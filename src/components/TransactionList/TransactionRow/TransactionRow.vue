<template>
  <div class="row">
    <!-- FIRST COLUMN -->
    <img class="mosaic_action" :src="getIcon()" alt="">

    <!-- SECOND COLUMN -->
    <div class="col2 overflow_ellipsis">
      <AddressDisplay :address="transaction.signer.address" />
      <ActionDisplay :transaction="transaction" />
    </div>

    <!-- THIRD COLUMN -->
    <div class="col3">

      <!-- Display details if transfer -->
      <div v-if="transaction.type === TransactionType.TRANSFER">
        <div v-for="(mosaic, index) in transaction.mosaics"
              :key="index">
          <MosaicAmountDisplay :amount="mosaic.amount"
                                :id="mosaic.id"
                                :color="isIncomingTransaction() ? 'green' : 'red'" />
        </div>
      </div>

      <!-- Display fee if not transfer -->
      <div v-else>
        <MosaicAmountDisplay :amount="getFeeAmount()"
                              :id="networkMosaic"
                              :color="'red'" />
      </div>
    </div>

    <!-- FOURTH COLUMN -->
    <div class="col4">
      {{ getHeight() }}
    </div>

    <!-- FIFTH COLUMN -->
    <div class="col5">
      <span class="item">
        <a
          class="url_text"
          target="_blank"
          :href="(explorerBaseUrl + '/transaction/' + transaction.transactionInfo.hash)"
        >{{ formatters.miniHash(c.txHeader.hash) }} </a>
      </span>
      <span class="item bottom">{{ c.txHeader.time }}</span>
    </div>

    <!-- SIXTH COLUMN -->
    <div class="col6">
      <img v-if="transaction.isConfirmed()"
        :src="dashboardImages.dashboardConfirmed"
        class="expand_mosaic_info"
      >
      <img v-else
        :src="dashboardImages.dashboardUnconfirmed"
        class="expand_mosaic_info"
      >
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {TransactionRowTs} from './TransactionRowTs'

export default class TransactionRow extends TransactionRowTs {}
</script>
