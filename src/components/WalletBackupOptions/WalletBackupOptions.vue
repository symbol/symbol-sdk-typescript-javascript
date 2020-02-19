<template>
  <div class="account-type">
    <div class="account-item">
      <div class="img-box radius"><img src="@/views/resources/img/symbol/EncryptedMessage.png"></div>
      <p class="access-name">{{ $t('wallets_backup_tile_title') }}</p>
      <p class="access-info">{{ $t('wallets_backup_tile_description') }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletBackupOptionsTs} from './WalletBackupOptionsTs'
import './WalletBackupOptions.less'

export default class WalletBackupOptions extends WalletBackupOptionsTs {}
</script>
