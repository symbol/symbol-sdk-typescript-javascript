<template>
  <div v-if="!!transaction" class="transaction-details-wrapper">
    <div class="top-container">
      <div v-if="!!view.info" class="transaction-hash top-transaction-item">
        <span class="transaction-info-title">{{ $t('hash') }}：</span>
        <span class="bolder">
          <a class="url_text" target="_blank" :href="(explorerBaseUrl + '/transaction/' + view.info.hash)">
            {{ view.info.hash }}
          </a>
        </span>
      </div>

      <div class="top-transaction-item transaction-status">
        <span class="transaction-info-title">{{ $t('status') }}：</span>
        <span class="bolder">{{ view.transaction.isConfirmed() ? $t('confirmed') : $('unconfirmed') }}</span>
      </div>

      <div class="top-transaction-item">
        <span class="transaction-type">
          <span class="transaction-info-title">{{ $t('transaction_type') }}：</span>
          <span class="bolder">{{ $t('transaction_descriptor_' + view.transaction.type) }}</span>
        </span>
        <span class="transaction-fee">
          <span class="transaction-info-title">
            {{ $t(view.transaction.isConfirmed() ? 'paid_fee' : 'max_fee' ) }}:
          </span>
          <span class="bolder">
            <MosaicAmountDisplay :id="networkMosaic" :amount="getFeeAmount()" />
            {{ networkMosaicTicker }}
          </span>
        </span>
      </div>
      <div class="top-transaction-item">
        <span v-if="view.transaction.isConfirmed()" class="transaction-deadline">
          <span class="transaction-info-title">{{ $t('block_height') }}：</span>
          <span class="bolder">{{ ($t('block') + ' #' + view.info.height.compact()) }}</span>
        </span>

        <span v-else class="transaction-deadline">
          <span class="transaction-info-title">{{ $t('deadline') }}：</span>
          <span
            class="bolder"
          >
            {{ view.values.get('deadline').value.toLocalDate() }} {{ view.values.get('deadline').value.toLocalTime() }}
          </span>
        </span>
      </div>
    </div> <!-- /.top-container -->

    <div class="bottom-transaction-details">
      <div>
        {{ JSON.stringify(view.values) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TransactionDetailsTs } from './TransactionDetailsTs'
import './TransactionDetails.less'

export default class TransactionDetails extends TransactionDetailsTs {}
</script>
