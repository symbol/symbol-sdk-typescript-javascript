<template>
  <div class="transaction-details-wrapper">
    <div class="top-container">
      <div v-if="!!transaction.transactionInfo" class="transaction-hash top-transaction-item">
        <span class="transaction-info-title">{{ $t('hash') }}：</span>
        <span class="bolder">
          <a class="url_text" target="_blank" :href="(explorerBaseUrl + '/transaction/' + transaction.transactionInfo.hash)">
            {{ transaction.transactionInfo.hash }}
          </a>
        </span>
      </div>

      <div class="top-transaction-item transaction-status">
        <span class="transaction-info-title">{{ $t('status') }}：</span>
        <span class="bolder">{{ transaction.isConfirmed() ? $t('confirmed') : $('unconfirmed') }}</span>
      </div>

      <div class="top-transaction-item">
        <span class="transaction-type">
          <span class="transaction-info-title">{{ $t('transaction_type') }}：</span>
          <span class="bolder">{{ $t('transaction_descriptor_' + transaction.type) }}</span>
        </span>
        <span class="transaction-fee">
          <span class="transaction-info-title">
            {{ $t(transaction.isConfirmed() ? 'paid_fee' : 'max_fee' ) }}:
          </span>
          <span class="bolder">
            <MosaicAmountDisplay :id="networkMosaic" :amount="getFeeAmount(transaction)" />
            {{ networkCurrencyTicker }}
          </span>
        </span>
      </div>
      <div class="top-transaction-item">
        <span v-if="transaction.isConfirmed()" class="transaction-deadline">
          <span class="transaction-info-title">{{ $t('block_height') }}：</span>
          <span class="bolder">{{ ($t('block') + ' #' + transaction.transactionInfo.height.compact()) }}</span>
        </span>

        <span v-else class="transaction-deadline">
          <span class="transaction-info-title">{{ $t('deadline') }}：</span>
          <span
            class="bolder"
          >
            {{ transaction.deadline.value.toLocalDate() }} {{ transaction.deadline.value.toLocalTime() }}
          </span>
        </span>
      </div>

    </div> <!-- /.top-container -->
<!--
    <div class="bottom-transaction-details">
      <TransactionInfoTemplate
        :transaction-details="transactionDetails"
        :cosigned-by="transaction.dialogDetailMap.cosigned_by || null"
      />
    </div>
-->
  </div>
</template>

<script lang="ts">
import { TransactionDetailsTs } from './TransactionDetailsTs'
import './TransactionDetails.less'

export default class TransactionDetails extends TransactionDetailsTs {}
</script>
