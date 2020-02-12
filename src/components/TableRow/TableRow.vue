<template>
  <div
    :class="[
      'table-row-container',
      assetType === 'mosaic' ? 'mosaic-columns' : 'namespace-columns',
    ]"
  >
    <div
      v-for="(value, name, index) in rowValues"
      :key="index"
      :class="['table-cell', `${name}-cell`]"
    >
      <div v-if="name === 'balance'" class="amount-display">
        <AmountDisplay :value="value" />
      </div>
      <div v-else>
        {{ value }}
      </div>
    </div>
    <div class="edit-icon-cell">
      <Icon type="md-create" class="edit-icon" />
    </div>
  </div>
</template>

<script lang="ts">
import { TableRowTs } from './TableRowTs'
import './TableRow.less'

export default class TableRow extends TableRowTs {}
</script>

<style scoped lang="less">
@import "../TableDisplay/TableDisplay.less";
@import "./TableRow.less";
</style>
