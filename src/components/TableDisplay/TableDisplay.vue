<template>
  <div class="table-container">
    <div class="upper-section-container">
      <div class="table-title-container section-title">
        <slot name="table-title" />
      </div>
      <div class="table-actions-container">
        <span @click="refresh()">{{ $t('refresh') }}</span>
        <div @click="filterBy('expiration')">
          <Checkbox :value="filteredBy.filteringType === 'show'" />
          <span v-if="assetType === 'mosaic'">{{ $t('Display_expired_mosaic') }}</span>
          <span v-else>{{ $t('Hide_expired_namespaces') }}</span>
        </div>
      </div>
    </div>
    <div
      :class="[                                         
        'table-header-container',
        assetType === 'mosaic' ? 'mosaic-columns' : 'namespace-columns',
      ]"
    >
      <div
        v-for="({name, label}, index) in tableFields"
        :key="index"
        :class="[ 'table-header-item', `${name}-header` ]"
        @click="sortBy(name)"
      >
        <span>{{ $t(label) }}</span>
        <Icon
          v-if="sortedBy.fieldName === name"
          class="sort-icon"
          :type="sortedBy.direction === 'asc'
            ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
        />
      </div>
      <!-- Enmpty header for the action button column -->
      <div>&nbsp;</div>
    </div>
    <div class="table-body-container">
      <Spin
        v-if="loading" size="large" fix
        class="absolute"
      />
      <div v-if="displayedValues.length" class="table-rows-container">
        <TableRow
          v-for="(rowValues, index) in currentPageRows"
          :key="index"
          :row-values="rowValues"
          :asset-type="assetType"
          @on-show-alias-form="showAliasForm"
        />
      </div>
      <div v-else class="empty-container">
        <span class="no-data">{{ $t('no_data') }}</span>
      </div>
    </div>

    <div class="table-footer-container">
      <Page
        class="page"
        :total="displayedValues.length"
        :page-size="pageSize"
        @on-change="handlePageChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { TableDisplayTs } from './TableDisplayTs'

export default class TableDisplay extends TableDisplayTs {}
</script>

<style scoped lang="less">
@import "./TableDisplay.less";
</style>
