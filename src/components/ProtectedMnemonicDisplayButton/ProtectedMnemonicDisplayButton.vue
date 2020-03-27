<template>
  <div>
    <div class="backup-item" @click="onClickDisplay">
      <div class="img-box radius">
        <img src="@/views/resources/img/symbol/EncryptedMessage.png">
      </div>
      <p class="access-name">
        {{ $t('wallets_backup_tile_mnemonic') }}
      </p>
      <p class="access-info">
        {{ $t('wallets_backup_tile_mnemonic_desc') }}
      </p>
    </div>

    <ModalMnemonicDisplay
      v-if="hasMnemonicExportModal"
      :visible="hasMnemonicExportModal"
      @close="hasMnemonicExportModal = false"
    />
  </div>
</template>

<script>
import { ProtectedMnemonicDisplayButtonTs } from './ProtectedMnemonicDisplayButtonTs'
export default class ProtectedMnemonicDisplayButton extends ProtectedMnemonicDisplayButtonTs {}
</script>
