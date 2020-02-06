<template>
  <div>
    <div class="addressQRCode">
      <img :src="qrCode$">
    </div>
    <p class="codeTit">
      {{ $t('Address_QR_code') }}
    </p>
  </div>
</template>

<script lang="ts">
import {WalletContactQRTs} from './WalletContactQRTs'
import './WalletContactQR.less'

export default class WalletContactQR extends WalletContactQRTs {}
</script>
