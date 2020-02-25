<template>
  <div class="backup-options-container">
    <div class="single-backup-option">
      <div class="backup-explain">
        <span class="subtitle">{{ $t('wallets_backup_title_qrcode') }}</span>
        <p>{{ $t('wallets_backup_qrcode_explain_p1')}}</p>
        <p>{{ $t('wallets_backup_qrcode_explain_p2')}}</p>
      </div>
      <div class="backup-options">
        <ProtectedMnemonicQRButton :wallet="wallet" />
      </div>
    </div>
    <div class="single-backup-option">
      <div class="backup-explain">
        <span class="subtitle">{{ $t('wallets_backup_title_mnemonic') }}</span>
        <p>{{ $t('wallets_backup_mnemonic_explain_p1')}}</p>
        <p>{{ $t('wallets_backup_mnemonic_explain_p2')}}</p>
      </div>
      <div class="backup-options">
        <ProtectedMnemonicDisplayButton :wallet="wallet" />
      </div>
    </div>
    <div class="single-backup-option">
      <div class="backup-explain">
        <span class="subtitle">{{ $t('wallets_backup_title_keystore') }}</span>
        <p>{{ $t('wallets_backup_keystore_explain_p1')}}</p>
        <p>{{ $t('wallets_backup_keystore_explain_p2')}}</p>
      </div>
      <div class="backup-options">
        <div class="backup-item">
          <div class="img-box radius"><img src="@/views/resources/img/symbol/Keypair.png"></div>
          <p class="access-name">{{ $t('wallets_backup_tile_keystore') }}</p>
          <p class="access-info">{{ $t('wallets_backup_tile_keystore_desc') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletBackupOptionsTs} from './WalletBackupOptionsTs'
import './WalletBackupOptions.less'

export default class WalletBackupOptions extends WalletBackupOptionsTs {}
</script>
