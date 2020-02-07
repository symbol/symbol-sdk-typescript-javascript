<template>
  <div>
    <span class="wallet-detail-label">{{ $t('privatekey') }}</span>
    <span v-if="hasPlainPrivateKey">{{ decryptKey() }}</span>
    <button
      type="button"
      class="button-style validation-button right-side-button eye-button" 
      @click="onClickDisplay"
    >
      <Icon type="md-eye" />
    </button>

    <ModalFormAccountUnlock
      v-if="hasAccountUnlockModal"
      :visible="hasAccountUnlockModal"
      :on-success="onAccountUnlocked"
      @close="hasAccountUnlockModal = false"
    />
  </div>
</template>

<script>
import { ProtectedPrivateKeyDisplayTs } from './ProtectedPrivateKeyDisplayTs'
import '@/styles/forms.less'
export default class ProtectedPrivateKeyDisplay extends ProtectedPrivateKeyDisplayTs {}
</script>

<style lang="less" scoped>
@import '../WalletDetails/WalletDetails.less';

.eye-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
