<template>
  <div ref="confirmedTableBody" class="table_body hide_scroll" @scroll="divScroll">
    <div
      v-for="(transaction, index) in currentPageTransactions"
      :key="index"
      class="table_item pointer "
      @click="onClickTransaction(transaction)"
    >
      <!-- FIRST COLUMN -->
      <slot name="column1">
        <img class="mosaic_action" :src="getIcon(transaction)" alt="">
      </slot>

      <!-- SECOND COLUMN -->
      <div class="col2 overflow_ellipsis">
        <slot name="column2">
          <AddressDisplay :address="transaction.signer.address" />
          <ActionDisplay :transaction="transaction" />
        </slot>
      </div>

      <!-- THIRD COLUMN -->
      <div class="col3">
        <slot name="column3">
          <!-- Display details if transfer -->
          <div v-if="transaction.type === TransactionType.TRANSFER">
            <div v-for="(mosaic, index) in transaction.mosaics"
                  :key="index">
              <MosaicAmountDisplay :amount="mosaic.amount"
                                    :id="mosaic.id"
                                    :color="isIncomingTransaction(transaction) ? 'green' : 'red'" />
            </div>
          </div>

          <!-- Display fee if not transfer -->
          <div v-else>
            <MosaicAmountDisplay :amount="getFeeAmount(transaction)"
                                  :id="networkMosaic"
                                  :color="'red'" />
          </div>
        </slot>
      </div>

      <!-- FOURTH COLUMN -->
      <div class="col4">
        {{ transaction.transactionInfo?.height.compact() || $('unconfirmed')}}
      </div>

      <!-- FIFTH COLUMN -->
      <div class="col5">
        <span class="item">
          <a
            class="url_text"
            target="_blank"
            :href="openExplorer(c.txHeader.hash)"
          >{{ miniHash(c.txHeader.hash) }} </a>
        </span>
        <span class="item bottom">{{ c.txHeader.time }}</span>
      </div>

      <!-- SIXTH COLUMN -->
      <div class="col6">
        <img
          v-if="!c.isTxConfirmed"
          src="@/common/img/monitor/dash-board/dashboardUnconfirmed.png"
          class="expand_mosaic_info"
        >
        <img
          v-if="c.isTxConfirmed"
          src="@/common/img/monitor/dash-board/dashboardConfirmed.png"
          class="expand_mosaic_info"
        >
      </div>


      <div v-if="!transactionList.length" class="no_data">
        {{ $t('no_confirmed_transactions') }}
      </div>
    </div>
  </div>
</template>

<script>
import {Component, Vue, Prop} from 'vue-property-decorator'
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// @ts-ignore
import AddressDisplay from '@/components/AddressDisplay/AddressDisplay.vue'
// @ts-ignore
import ActionDisplay from '@/components/ActionDisplay/ActionDisplay.vue'

@Component({components: {
  AddressDisplay,
  ActionDisplay,
  MosaicAmountDisplay,
}})
export default class TransactionListBody extends Vue {}
</script>
