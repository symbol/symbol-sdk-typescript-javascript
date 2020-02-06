<template>
  <div class="qr_content secondary_page_animate">
    <div class="left_container">
      <img id="qrImg" :src="qrCode$" alt="Transaction QR code">
      <div class="qr_info">
        <div id="address_text" class="address_text top-qr-text">
          <span class="top-qr-text-title">{{ $t('Recipient') }}:</span>
          <span class="gray">{{ recipient }}</span>
        </div>

        <div class="top-qr-text overflow_ellipsis">
          <span class="top-qr-text-title">{{ $t('assets') }}:</span>
          <div v-if="balanceEntries.length">
            <div 
              v-for="({mosaicHex, name, amount}, index) in balanceEntries"
              :key="index"
            >
              <span class="blue">{{ amount }}&nbsp;</span>
              <span class="blue">{{ name }}</span>
              <span class="gray">（{{ mosaicHex }}）</span>
            </div>
          </div>
          <span v-else>{{ 'N/A' }}</span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('message') }}:</span>
          <span>{{ transaction && transaction.message.payload }}</span>
        </div>

        <div class="qr_button">
          <span class="radius pointer" @click="onDownloadQR">{{ $t('Download') }}</span>
        </div>
      </div>
    </div>
    <!--
    <CollectionRecord :transaction-type="TransferType.RECEIVED" />
    -->

    <div class="modal scroll">
      <FormTransferCreation
        :hide-signer="true"
        :disable-submit="true"
        @onTransactionChange="onInvoiceChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import {DashboardInvoicePageTs} from './DashboardInvoicePageTs'
import './DashboardInvoicePage.less'

export default class DashboardInvoicePage extends DashboardInvoicePageTs {}
</script>
