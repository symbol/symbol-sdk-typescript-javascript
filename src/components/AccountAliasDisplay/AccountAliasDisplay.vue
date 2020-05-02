<template>
  <div class="account-detail-row-3cols">
    <span class="label">{{ $t('Aliases') }}</span>
    <div class="value account-aliases">
      <span v-for="(alias, index) in accountAliases" :key="index">
        {{ index === accountAliases.length - 1 ? `${alias}` : `${alias},` }}
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { AccountAliasDisplayTs } from './AccountAliasDisplayTs'
export default class AccountAliasDisplay extends AccountAliasDisplayTs {}
</script>

<style lang="less" scoped>
.copy-icon {
  width: 0.24rem;
  height: 0.24rem;
  margin-left: 0.18rem;
  cursor: pointer;
}

.account-aliases {
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: max-content;

  span {
    margin-right: 0.08rem;
  }
}
</style>
