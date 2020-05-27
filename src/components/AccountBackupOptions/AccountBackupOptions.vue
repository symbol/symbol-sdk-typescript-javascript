<template>
  <div class="backup-options-container">
    <div class="single-backup-option">
      <div class="backup-explain">
        <span class="subtitle">{{ $t('accounts_backup_title_qrcode') }}</span>
        <p>{{ $t('accounts_backup_qrcode_explain_p1') }}</p>
        <p>{{ $t('accounts_backup_qrcode_explain_p2') }}</p>
      </div>
      <div class="backup-options">
        <ProtectedMnemonicQRButton :account="account" />
      </div>
    </div>
    <div class="single-backup-option">
      <div class="backup-explain">
        <span class="subtitle">{{ $t('accounts_backup_title_mnemonic') }}</span>
        <p>{{ $t('accounts_backup_mnemonic_explain_p1') }}</p>
        <p>{{ $t('accounts_backup_mnemonic_explain_p2') }}</p>
      </div>
      <div class="backup-options">
        <ProtectedMnemonicDisplayButton :account="account" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { AccountBackupOptionsTs } from './AccountBackupOptionsTs'
export default class AccountBackupOptions extends AccountBackupOptionsTs {}
</script>
<style lang="less" scoped>
@import './AccountBackupOptions.less';
</style>
