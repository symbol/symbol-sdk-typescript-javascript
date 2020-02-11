<template>
  <div class="top-container transaction-header-container">
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
      <span class="bolder">{{ !!view.info ? $t('confirmed') : $t('unconfirmed') }}</span>
    </div>

    <div class="top-transaction-item">
      <span class="transaction-type">
        <span class="transaction-info-title">{{ $t('transaction_type') }}：</span>
        <span class="bolder">{{ $t('transaction_descriptor_' + view.transaction.type) }}</span>
      </span>
      <span class="transaction-fee">
        <span class="transaction-info-title">
          {{ $t(!!view.info ? 'paid_fee' : 'max_fee' ) }}:
        </span>
        <span class="bolder">
          <MosaicAmountDisplay :id="networkMosaic" :amount="getFeeAmount()" />
          {{ networkMosaicTicker }}
        </span>
      </span>
    </div>
    <div class="top-transaction-item">
      <span v-if="!!view.info" class="transaction-deadline">
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
</template>

<script lang="ts">
import {TransactionDetailsHeaderTs} from './TransactionDetailsHeaderTs'
import './TransactionDetailsHeader.less'
export default class TransactionDetailsHeader extends TransactionDetailsHeaderTs {}
</script>
