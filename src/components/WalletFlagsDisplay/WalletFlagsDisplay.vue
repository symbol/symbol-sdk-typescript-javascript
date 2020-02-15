<template>
  <div class="wallet-detail-row">
    <span class="label">{{ $t('wallets_label_') }}</span>
    <div class="value">
      <div v-if="!wallet.values.get('isMultisig')" class="tag">
        <img src="@/views/resources/img/symbol/Account.png" />
        <span>&nbsp;{{ $t('wallets_flags_simple') }}</span>
      </div>
      <div v-else class="tag">
        <img src="@/views/resources/img/symbol/Multisignature.png" />
        <span>&nbsp;{{ $t('wallets_flags_multisig') }}</span>
      </div>
      <div v-if="defaultWallet === wallet.getIdentifier()" class="tag">
        <img src="@/views/resources/img/symbol/Dashboard.png" />
        <span>&nbsp;{{ $t('wallets_flags_default_wallet') }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletFlagsDisplayTs} from './WalletFlagsDisplayTs'
export default class WalletFlagsDisplay extends WalletFlagsDisplayTs {}
</script>

<style lang="less" scoped>
.tag {
  margin-right: 20px;
  width: 180px;
  display: flex;
  justify-content: space-around;

  img {
    width: 32px;
  }
  
  span {
    margin-top: 3px;
  }
}
</style>
