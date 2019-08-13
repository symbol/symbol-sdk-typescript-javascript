<template>
  <div class="qr_content">
    <Modal
            :title="$t('set_amount')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="asset flex_center">
        <span class="title">{{$t('asset_type')}}</span>
        <span class="value radius flex_center">
              <Select placeholder="XEM" v-model="assetType" class="asset_type">
              <Option v-for="item in mosaicList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            </span>
      </div>
      <div class="amount flex_center">
        <span class="title">{{$t('transfer_amount')}}</span>
        <span class="value radius flex_center">
              <input type="text" v-model="assetAmount">
                  <span class="mosaic_type">xem</span>
        </span>
      </div>
      <div class="remark flex_center">
        <span class="title">{{$t('remarks')}}</span>
        <span class=" textarea_container flex_center value radius ">
              <textarea name="" id="" cols="70" rows="4"></textarea>
            </span>
      </div>
      <div @click="genaerateQR()" class="send_button pointer">
        {{$t('generate_QR_code')}}
      </div>
    </Modal>

    <div class="left_container radius">
      <div class="amount">{{assetAmount}}XEM</div>
      <img id="qrImg" :src="QRCode" alt="">
      <div class="address_text" id="address_text">
        {{accountAddress}}
      </div>
      <div class="qr_button ">
        <span class="radius pointer" @click="copyAddress">{{$t('copy_address')}}</span>
        <span class="radius pointer" @click="showAssetSettingDialog()">{{$t('set_amount')}}</span>
        <span class="radius pointer" @click="downloadQR">{{$t('copy_QR_code')}}</span>
      </div>
    </div>

    <CollectionRecord :transactionType="1"></CollectionRecord>
  </div>
</template>

<script lang="ts">
    import {MonitorReceiptTs} from './MonitorReceiptTs'

    export default class MonitorReceipt extends MonitorReceiptTs {

    }
</script>
<style scoped lang="less">
  @import "MonitorReceipt.less";
</style>
