<template>
  <div>
    <Select
      v-model="selectedAddress" size="large" prefix="ios-home"
      @input="onAddressChange"
    >
      <Icon slot="prefix" type="ios-people" size="24" />
      <OptionGroup label="Multisig accounts">
        <Option v-for="item in addresses" :key="item.publicKey" :value="item.publicKey">
          {{ item.label }}
        </Option>
      </OptionGroup>
    </Select>
  </div>
</template>
<script lang="ts">
// @ts-ignore
import { TransactionAddressFilterTs } from './TransactionAddressFilterTs'
export default class TransactionAddressFilter extends TransactionAddressFilterTs { }
</script>
<style lang="less" scoped>
  @import "./TransactionAddressFilter.less";
</style>
