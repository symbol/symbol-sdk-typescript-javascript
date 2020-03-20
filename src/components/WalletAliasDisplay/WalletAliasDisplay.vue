<template>
  <div class="wallet-detail-row-3cols">
    <span class="label">{{ $t('Aliases') }}</span>
    <div class="value wallet-aliases">
      <span v-for="(alias, index) in walletAliases" :key="index">
        {{ index === walletAliases.length - 1
          ? `${alias}`
          : `${alias},`
        }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import {WalletAliasDisplayTs} from './WalletAliasDisplayTs'
export default class WalletAliasDisplay extends WalletAliasDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: .24rem;
  height: .24rem;
  margin-left: .18rem;
  cursor: pointer;
}

.wallet-aliases {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;

  span{
    margin-right: 0.08rem;
  }
}
</style>
