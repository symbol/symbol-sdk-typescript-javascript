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
      :class="[ 'table-cell', `${name}-cell` ]"
    >
      <div v-if="name === 'balance'">
        <AmountDisplay :value="value" />
      </div>
      <div v-else>
        {{ value }}
      </div>
    </div>
    <div class="edit-icon-cell">
      <Poptip v-if="hasAvailableActions" placement="bottom-end">
        <Icon type="md-create" class="edit-icon" />
        <div slot="content" class="asset-action-section">
          <p class="poptip-actions" @click="$emit('on-show-alias-form', rowValues)">
            <Icon type="ios-link" class="edit-icon" />
            <span>
              {{ $t(aliasActionLabel) }}
            </span>
          </p>
          <p v-if="isRootNamespace" @click="$emit('on-show-extend-namespace-duration-form', rowValues)">
            <Icon type="md-create" class="edit-icon" />
            <span>
              {{ $t('action_label_extend_duration') }}
            </span>
          </p>
          <p v-if="isSupplyMutableMosaic" @click="$emit('on-show-mosaic-supply-change-form', rowValues)">
            <Icon type="md-create" class="edit-icon" />
            <span>
              {{ $t('action_label_modify_supply') }}
            </span>
          </p>
        </div>
      </Poptip>
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
