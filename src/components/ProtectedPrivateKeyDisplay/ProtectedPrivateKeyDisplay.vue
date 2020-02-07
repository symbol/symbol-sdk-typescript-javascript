<template>
  <div class="wallet-details-container">
    <div class="detail-row">
      <span class="wallet-detail-label">{{ $t('privatekey') }}</span>
      <div v-if="hasPlainPrivateKey">
        <span>{{ plainInformation }}</span>
        &nbsp;<img src="@/views/resources/img/wallet/copyIcon.png"
            class="copy-icon"
            @click="uiHelpers.copyToClipboard(plainInformation)" />
        <span> ({{ $t('x_seconds', {seconds: secondsCounter}) }})</span>
      </div>
      <button v-else
        type="button"
        class="button-style validation-button right-side-button eye-button" 
        @click="onClickDisplay"
      >
        <Icon type="md-eye" />
      </button>
    </div>

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

.wallet-details-container {
  height: 100%;
  display: grid;
}

.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}
.eye-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
