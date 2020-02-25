<template>
  <div class="modal-export-mnemonic-container">
    <Modal
      v-model="show"
      :title="$t('modal_title_backup_mnemonic_qrcode')"
      :transfer="false"
    >
      <div class="form-unlock">
        <FormAccountUnlock @success="onAccountUnlocked" @error="onError" />
      </div>
      <div v-if="hasMnemonicInfo" class="body">
        <img id="qrImg" class="qr-image" :src="qrBase64" alt="Mnemonic QR code" />

        <button disabled>Download QR</button>
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
.modal-export-mnemonic-container {
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 100%;

  .ivu-modal-wrap {
    overflow: hidden;
  }

  .ivu-modal {
    width: 12rem !important;

    .ivu-modal-content {
      width: 12rem !important;

      .ivu-modal-body {
        width: 12rem !important;

        .form-unlock {
          display: grid;
          grid-template-rows: 1rem;
          grid-template-columns: 100%;
        }

        .body {
          display: grid;
          grid-template-rows: 2rem 1rem;
          grid-template-columns: 100%;

          .qr-image {
            width: 2rem;
            height: 2rem;
            margin: auto;
          }
        }
      }
    }
  }
}
</style>