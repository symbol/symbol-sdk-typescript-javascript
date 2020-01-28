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
          <span>
            <span class="blue">{{ selectedMosaic.name || 'N/A' }}</span>
            <span class="gray">（{{ selectedMosaic.id.toHex() || 'N/A' }}）</span>
          </span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('amount') }}:</span>
          <span class="black">{{ formItems.amount || 0 }}</span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('message') }}:</span>
          <span>{{ formItems.message }}</span>
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

      <FormInvoiceCreation @change="onFormChange" />

    </div>
  </div>
</template>

<script lang="ts">
import {DashboardInvoicePageTs} from '@/views/dashboard/invoice/DashboardInvoicePageTs.ts'
import './DashboardInvoicePage.less'

export default class DashboardInvoicePage extends DashboardInvoicePageTs {}
</script>
