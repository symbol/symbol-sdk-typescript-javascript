<template>
<div>
  <div class="set-qr-image">
    {{ $t('set_qr_image') }}
  </div>
  <form onsubmit="event.preventDefault()">
    <div class="asset">
      <span class="title">{{ $t('asset_type') }}</span>
      <span class="input-container">
        <span class="value radius flex_center">
          <MosaicSelector :mosaics="currentWalletMosaics"
                           v-model="selectedMosaic" />
        </span>
        <span class="value radius flex_center">
          <AmountInput :mosaic-id="selectedMosaic"
                       :mosaics="currentWalletMosaics"
                        v-model="invoiceAmount" />
        </span>
      </span>
    </div>
  </form>
  <div class="remark flex_center">
    <span class="title">{{ $t('remarks') }}</span>
    <span class="textarea-container flex_center value radius">
      <MessageInput v-model="invoiceMessage" />
    </span>
    <span class="remark_length">{{ formItems.message.length }}/25</span>
  </div>
</div>
</template>

<script lang="ts">
import {FormInvoiceCreationTs} from './FormInvoiceCreationTs'
import './FormInvoiceCreation.less'

export default class FormInvoiceCreation extends FormInvoiceCreationTs {}
</script>
