<template>
  <div class="container">
    <Modal
      v-model="show"
      class-name="modal-container"
      :title="$t('modal_title_backup_mnemonic_qrcode')"
      :transfer="false"
    >
      <div class="form-unlock">
        <FormAccountUnlock v-if="!hasMnemonicInfo" @success="onAccountUnlocked" @error="onError" />
      </div>
      <div v-if="hasMnemonicInfo" class="body">
        <div class="explain">
          <span class="subtitle">{{ $t('wallets_backup_title_qrcode') }}</span>
          <p>{{ $t('wallets_backup_mnemonic_explain_qrcode') }}</p>
        </div>

        <img
          id="qrImg" class="qr-image" :src="qrBase64"
          alt="Mnemonic QR code"
        >

        <button class="button-style validation-button download-button" type="button" @click="onDownloadQR">
          <Icon :type="'md-download'" size="20" />
          <span>&nbsp;{{ $t('button_download_qr') }}</span>
        </button>
      </div>

      <div slot="footer" class="modal-footer">
        <button
          type="submit"
          class="centered-button button-style back-button float-right"
          @click="show = false"
        >
          {{ $t('close') }}
        </button>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { ModalMnemonicExportTs } from './ModalMnemonicExportTs'
export default class ModalMnemonicExport extends ModalMnemonicExportTs {}
</script>

<style lang="less" scoped>
@import "./ModalMnemonicExport.less";
</style>
