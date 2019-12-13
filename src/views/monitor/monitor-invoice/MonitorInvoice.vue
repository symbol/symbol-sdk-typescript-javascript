<template>
  <div class="qr_content secondary_page_animate">
    <Spin v-if="false" size="large" fix class="absolute"></Spin>
    <div class="left_container radius">
      <img id="qrImg" :src="qrCode$" alt="Transaction QR code"/>
      <div class="qr_info">

        <div class="address_text top-qr-text" id="address_text">
          <span class="top-qr-text-title">{{$t('account')}}:</span>
          <span class="gray">{{accountAddress}}</span>
        </div>

        <div class="top-qr-text overflow_ellipsis">
          <span class="top-qr-text-title">{{$t('assets')}}:</span>
          <span v-if="activeMosaic.name">
            <span class="blue">{{activeMosaic.name }}</span>
            <span class="gray">（{{activeMosaic.hex }}）</span>
          </span>
          <span v-else class="gray">
           {{activeMosaic.hex }}
          </span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{$t('amount')}}:</span>
          <span class="black">{{ formItems.mosaicAmount || 0 }}</span>
        </div>

        <div class="top-qr-text">
          <span class="top-qr-text-title">{{$t('message')}}:</span>
          <span>{{ formItems.message}}</span>
        </div>

        <div class="qr_button">
          <span class="radius pointer" @click="copyAddress">{{$t('copy_address')}}</span>
          <span class="radius pointer" @click="downloadQR">{{$t('Download')}}</span>
        </div>
      </div>
    </div>

    <CollectionRecord :transactionType="TransferType.RECEIVED"/>

    <div class="modal scroll">
      <form onsubmit="event.preventDefault()">
        <div class="asset">
          <span class="title">{{$t('asset_type')}}</span>
          <span class="input-container">
            <span class="value radius flex_center">
              <ErrorTooltip fieldName="selectedMosaicHex">
                <AutoComplete v-model="selectedMosaicHex"
                              :filter-method="filterMethod"
                              :placeholder="$t('Please_enter_mosaic_hex_or_alias')"
                              class="asset_type"
                              :data-vv-as="$t('asset_type')"
                              data-vv-name="selectedMosaicHex"
                              v-validate="'required|namespaceOrMosaicId'"
                              v-focus>
                  <Option v-for="m in mosaicList" :value="m.value" :key="m.value">
                    <span>{{ m.value }}</span>
                  </Option>
                </AutoComplete>
              </ErrorTooltip>
            </span>
            <span class="value radius flex_center">
              <ErrorTooltip fieldName="mosaicAmount">
                <input
                        class="amount_input"
                        type="text"
                        v-model="formItems.mosaicAmount"
                        v-validate="validation.invoiceAmount"
                        :placeholder="$t('Please_enter_the_amount_of_transfer')"
                        data-vv-name="mosaicAmount"
                />
              </ErrorTooltip>
            </span>
          </span>
        </div>
      </form>
      <div class="remark flex_center">
        <span class="title">{{$t('remarks')}}</span>
        <span class="textarea-container flex_center value radius">
          <ErrorTooltip fieldName="remarks">
            <textarea
                    class="radius"
                    v-model="formItems.message"
                    :placeholder="$t('Please_enter_notes')"
                    v-validate="'min:0|max:25'"
                    data-vv-name="remarks"
            />
          </ErrorTooltip>
        </span>
        <span class="remark_length">{{formItems.message.length}}/25</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import "./MonitorInvoice.less";

    import {MonitorInvoiceTs} from "@/views/monitor/monitor-invoice/MonitorInvoiceTs.ts";

    export default class MonitorInvoice extends MonitorInvoiceTs {
    }
</script>
<style scoped lang="less">
</style>
