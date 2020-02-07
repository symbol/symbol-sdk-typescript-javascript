<template>
  <div>
    <div class="clearfix">
      <span class="qr-code-title">{{ $t('Address_QR_code') }}</span>
    </div>

    <div class="clearfix">
      <img class="qr-code-image" :src="qrCode$">
    </div>
  </div>
</template>

<script lang="ts">
import { WalletContactQRTs } from './WalletContactQRTs'
export default class WalletContactQR extends WalletContactQRTs {}
</script>

<style scoped>
.clearfix {
  display: block;
  width: 100%;
  float: left;
  clear: both;
  text-align: center;
}

.qr-code-title {
  font-size: 16px;
  text-align: center;
  font-weight: 400;
}

.qr-code-image {
  width: 2.8rem;
  height: 2.8rem;
}
</style>
