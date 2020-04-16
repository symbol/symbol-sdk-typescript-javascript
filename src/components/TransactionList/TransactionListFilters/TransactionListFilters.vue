<template>
  <div class="transaction-list-filters-container">
    <div class="transaction-list-filter-container">
      <!--       <TransactionStatusFilter :defaultStatus="selectedOption" @status-change="onSelectedOptionChange"/> -->
      <TransactionStatusFilter :default-status="selectedOption" @status-change="onSelectedOptionChange" />
    </div>
    <div v-if="signers.length > 1" class="transaction-list-filter-container">
      <TransactionAddressFilter :addresses="signers" @address-change="onSelectedOptionChange" />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListFiltersTs } from './TransactionListFiltersTs'

export default class TransactionListFilters extends TransactionListFiltersTs { }
</script>

<style lang="less" scoped>
@import "./TransactionListFilters.less";
</style>
