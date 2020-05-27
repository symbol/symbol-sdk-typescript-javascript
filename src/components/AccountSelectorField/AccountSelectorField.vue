<template>
  <div v-if="currentAccounts.length" class="switch_account">
    <img
      v-if="!defaultFormStyle"
      class="select_account_icon"
      src="@/views/resources/img/window/windowWalletSelect.png"
    />
    <i-select
      v-model="currentAccountIdentifier"
      :class="{
        'select-size select-style': defaultFormStyle,
        'max-z-index': true,
      }"
    >
      <i-option v-for="{ id, name } in currentAccounts" :key="id" :value="id">
        {{ truncate(name) }}
      </i-option>
    </i-select>
  </div>
</template>

<script lang="ts">
import { AccountSelectorFieldTs } from './AccountSelectorFieldTs'
export default class AccountSelectorField extends AccountSelectorFieldTs {}
</script>
<style lang="less" scoped>
@import './AccountSelectorField.less';
</style>
