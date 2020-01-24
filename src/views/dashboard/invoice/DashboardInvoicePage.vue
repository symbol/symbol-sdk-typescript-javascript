<template>
  <div class="qr_content secondary_page_animate">
    <div class="left_container">
      <img id="qrImg" :src="qrCode$" alt="Transaction QR code">
      <div class="qr_info">
        <div id="address_text" class="address_text top-qr-text">
          <span class="top-qr-text-title">{{ $t('account') }}:</span>
          <span class="gray">{{ currentWallet.address().plain() }}</span>
        </div>

        <div class="top-qr-text overflow_ellipsis">
          <span class="top-qr-text-title">{{ $t('assets') }}:</span>
          <span v-if="activeMosaic.name">
            <span class="blue">{{ activeMosaic.name || 'N/A' }}</span>
            <span class="gray">（{{ activeMosaic.hex || 'N/A' }}）</span>
          </span>
          <span v-else class="gray">
            {{ activeMosaic.hex || 'N/A' }}
          </span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('amount') }}:</span>
          <span class="black">{{ formItems.mosaicAmount || 0 }}</span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('message') }}:</span>
          <span>{{ formItems.message }}</span>
        </div>

        <div class="qr_button">
          <span class="radius pointer" @click="copyAddress">{{ $t('copy_address') }}</span>
          <span class="radius pointer" @click="downloadQR">{{ $t('Download') }}</span>
        </div>
      </div>
    </div>

    <CollectionRecord :transaction-type="TransferType.RECEIVED" />

    <div class="modal scroll">

      <FormInvoiceCreation />

    </div>
  </div>
</template>

<script lang="ts">
import {DashboardInvoicePageTs} from '@/views/monitor/monitor-invoice/DashboardInvoicePageTs.ts'
import './DashboardInvoicePage.less'

export default class DashboardInvoicePage extends DashboardInvoicePageTs {}
</script>
