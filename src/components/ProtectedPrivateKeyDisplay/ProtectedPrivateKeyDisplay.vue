<template>
  <div>
    <span class="tit">{{ $t('privatekey') }}</span>
    <span v-if="hasPlainPrivateKey">{{ decryptKey() }}</span>
    <span class="edit-wallet-name" 
          @click.stop="hasPlainPrivateKey = true">
      <Icon type="md-eye" />
    </span>

    <ModalFormAccountUnlock
      v-if="!!this.clickedWallet"
      :visible="hasAccountUnlockModal"
      @success="hasPlainPrivateKey = true"
    />
  </div>
</template>

<script>
import { ProtectedPrivateKeyDisplayTs } from './ProtectedPrivateKeyDisplayTs'
export default class ProtectedPrivateKeyDisplay extends ProtectedPrivateKeyDisplayTs {}
</script>
