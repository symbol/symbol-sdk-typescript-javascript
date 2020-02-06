<template>
  <div>
    <span class="tit">{{ $t('privatekey') }}</span>
    <span v-if="hasPlainPrivateKey">{{ decryptKey() }}</span>
    <button class="edit-wallet-name" 
          @click="onClickDisplay">
      <Icon type="md-eye" />
    </button>

    <ModalFormAccountUnlock
      :visible="hasAccountUnlockModal"
      :on-success="onAccountUnlocked"
    />
  </div>
</template>

<script>
import { ProtectedPrivateKeyDisplayTs } from './ProtectedPrivateKeyDisplayTs'
export default class ProtectedPrivateKeyDisplay extends ProtectedPrivateKeyDisplayTs {}
</script>
