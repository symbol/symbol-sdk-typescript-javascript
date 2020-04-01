<template>
  <div class="wallet-detail-row-3cols">
    <span class="label">{{ $t('privatekey') }}</span>
    <div v-if="hasPlainPrivateKey" class="value">
      {{ plainInformation }}
      <img
        src="@/views/resources/img/wallet/copyIcon.png"
        class="copy-icon"
        @click="uiHelpers.copyToClipboard(plainInformation)"
      >
      <span class="timer-span"> &nbsp; ({{ $t('x_seconds', {seconds: secondsCounter}) }})</span>
    </div>
    <div v-else>
      <div class="value">
        ********
        <button
          type="button"
          class="button-style validation-button right-side-button eye-button" 
          @click="onClickDisplay"
        >
          <Icon type="md-eye" />
        </button>
      </div>
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
export default class ProtectedPrivateKeyDisplay extends ProtectedPrivateKeyDisplayTs {}
</script>

<style lang="less" scoped>
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

.value {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;
}

.timer-span {
  padding-left: 8px;
}
</style>
