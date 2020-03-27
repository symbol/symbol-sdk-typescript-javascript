<template>
  <div>
    <div class="backup-item" @click="onClickDisplay">
      <div class="img-box radius">
        <img src="@/views/resources/img/symbol/QRcode.png">
      </div>
      <p class="access-name">
        {{ $t('wallets_backup_tile_title') }}
      </p>
      <p class="access-info">
        {{ $t('wallets_backup_tile_description') }}
      </p>
    </div>

    <ModalMnemonicExport
      v-if="hasMnemonicExportModal"
      :visible="hasMnemonicExportModal"
      @close="hasMnemonicExportModal = false"
    />
  </div>
</template>

<script>
import { ProtectedMnemonicQRButtonTs } from './ProtectedMnemonicQRButtonTs'
export default class ProtectedMnemonicQRButton extends ProtectedMnemonicQRButtonTs {}
</script>
