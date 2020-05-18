<template>
  <div>
    <Select v-model="selectedStatus" size="large">
      <Icon slot="prefix" type="md-apps" size="24" />
      <Option class="select-all" :value="'all'">
        Recent
      </Option>
      <OptionGroup label="status">
        <Option :value="'confirmed'">
          Confirmed
        </Option>
        <Option :value="'unconfirmed'">
          Unconfirmed
        </Option>
        <Option :value="'partial'">
          Partial
        </Option>
      </OptionGroup>
    </Select>
  </div>
</template>
<script lang="ts">
// @ts-ignore
import { TransactionStatusFilterTs } from './TransactionStatusFilterTs'
export default class TransactionStatusFilter extends TransactionStatusFilterTs {}
</script>
<style lang="less" scoped>
@import './TransactionStatusFilter.less';
</style>
