<template>
  <div>
    <span class="wallet-detail-label">{{ $t('Wallet_name') }}</span>
    <span v-if="wallet" class="walletName">{{ wallet.values.get('name') }}</span>
    <span v-if="editable"
          @click.stop="hasNameFormModal = true"
          class="edit-wallet-name" >
      <Icon type="md-create"/>
    </span>

    <ModalFormWalletNameUpdate
      v-if="hasNameFormModal"
      :visible="hasNameFormModal"
      @close="hasNameFormModal = false" />

  </div>
</template>

<script lang="ts">
import {WalletNameDisplayTs} from './WalletNameDisplayTs'

export default class WalletNameDisplay extends WalletNameDisplayTs {}
</script>

<style lang="less" scoped>
@import '../WalletDetails/WalletDetails.less';
</style>
