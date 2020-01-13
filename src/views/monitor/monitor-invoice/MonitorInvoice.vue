<template>
  <div class="qr_content secondary_page_animate">
    <Spin
      v-if="false" size="large" fix
      class="absolute"
    />
    <div class="left_container">
      <img id="qrImg" :src="qrCode$" alt="Transaction QR code">
      <div class="qr_info">
        <div id="address_text" class="address_text top-qr-text">
          <span class="top-qr-text-title">{{ $t('account') }}:</span>
          <span class="gray">{{ accountAddress }}</span>
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
      <div class="set-qr-image">
        {{ $t('set_qr_image') }}
      </div>
      <form onsubmit="event.preventDefault()">
        <div class="asset">
          <span class="title">{{ $t('asset_type') }}</span>
          <span class="input-container">
            <span class="value radius flex_center">
              <ErrorTooltip field-name="selectedMosaicHex">
                <AutoComplete
                  v-model="selectedMosaicHex"
                  v-validate="'required|namespaceOrMosaicId'"
                  v-focus
                  :filter-method="filterMethod"
                  :placeholder="$t('Please_enter_mosaic_hex_or_alias')"
                  class="asset_type"
                  :data-vv-as="$t('asset_type')"
                  data-vv-name="selectedMosaicHex"
                >
                  <Option v-for="m in mosaicList" :key="m.value" :value="m.value">
                    <span>{{ m.value }}</span>
                  </Option>
                </AutoComplete>
              </ErrorTooltip>
            </span>
            <span class="value radius flex_center">
              <ErrorTooltip field-name="mosaicAmount">
                <input
                  v-model="formItems.mosaicAmount"
                  v-validate="validation.invoiceAmount"
                  class="amount_input"
                  type="text"
                  :placeholder="$t('Please_enter_the_amount_of_transfer')"
                  data-vv-name="mosaicAmount"
                >
              </ErrorTooltip>
            </span>
          </span>
        </div>
      </form>
      <div class="remark flex_center">
        <span class="title">{{ $t('remarks') }}</span>
        <span class="textarea-container flex_center value radius">
          <ErrorTooltip field-name="remarks">
            <textarea
              v-model="formItems.message"
              v-validate="'min:0|max:25'"
              class="radius"
              :placeholder="$t('Please_enter_notes')"
              data-vv-name="remarks"
            />
          </ErrorTooltip>
        </span>
        <span class="remark_length">{{ formItems.message.length }}/25</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import './MonitorInvoice.less'

import {MonitorInvoiceTs} from '@/views/monitor/monitor-invoice/MonitorInvoiceTs.ts'

export default class MonitorInvoice extends MonitorInvoiceTs {
}
</script>
<style scoped lang="less">
</style>
