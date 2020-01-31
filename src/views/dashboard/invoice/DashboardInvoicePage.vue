<template>
  <div class="qr_content secondary_page_animate">
    <div class="left_container">
      <img id="qrImg" :src="qrCode$" alt="Transaction QR code">
      <div class="qr_info">
        <div id="address_text" class="address_text top-qr-text">
          <span class="top-qr-text-title">{{ $t('account') }}:</span>
          <span class="gray">{{ formItems.recipient || 'N/A' }}</span>
        </div>

        <div class="top-qr-text overflow_ellipsis">
          <span class="top-qr-text-title">{{ $t('assets') }}:</span>
          <span v-if="formItems.attachedMosaics.length"
                v-for="(selectedMosaic, index) in formItems.attachedMosaics">
            <span class="blue">{{ selectedMosaic.amount }}</span>
            <span class="blue">{{ selectedMosaic.name }}</span>
            <span class="gray">（{{ selectedMosaic.id.toHex() }}）</span>
          </span>
          <span v-else>{{ 'N/A' }}</span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{ $t('message') }}:</span>
          <span>{{ formItems.messagePlain }}</span>
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

      <FormInvoiceCreation @input="onFormChange" />

    </div>
  </div>
</template>

<script lang="ts">
import {DashboardInvoicePageTs} from '@/views/dashboard/invoice/DashboardInvoicePageTs.ts'
import './DashboardInvoicePage.less'

export default class DashboardInvoicePage extends DashboardInvoicePageTs {}
</script>
