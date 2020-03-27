<template>
  <div class="wallet-detail-row">
    <div class="label">
      {{ $t('Wallet_name') }}
    </div>
    <div class="value">
      <span v-if="wallet" class="walletName">{{ wallet.values.get('name') }}</span>
      <button
        type="button"
        class="button-style validation-button right-side-button edit-button"
        @click.stop="hasNameFormModal = true"
      >
        <Icon type="md-create" />
      </button>
    </div>

    <ModalFormWalletNameUpdate
      v-if="hasNameFormModal"
      :visible="hasNameFormModal"
      @close="hasNameFormModal = false"
    />
  </div>
</template>

<script lang="ts">
import { WalletNameDisplayTs } from './WalletNameDisplayTs'

export default class WalletNameDisplay extends WalletNameDisplayTs {}
</script>

<style lang="less" scoped>
.edit-button {
  height: 0.35rem !important;
  padding: 0 0.3rem;
}
</style>
