<template>
  <div class="table-container">
    <div class="upper-section-container">
      <div class="table-title-container section-title">
        <slot name="table-title" />
      </div>
      <div class="table-actions-container">
        <span @click="refresh()">{{ $t('refresh') }}</span>
        <div @click="setFilteredBy('expiration')">
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
        @click="setSortedBy(name)"
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
          :owned-asset-hex-ids="ownedAssetHexIds"
          @on-show-alias-form="showAliasForm"
          @on-show-extend-namespace-duration-form="showExtendNamespaceDurationForm"
          @on-show-mosaic-supply-change-form="showModifyMosaicSupplyForm"
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
    <ModalFormWrap
      v-if="modalFormsVisibility.aliasTransaction"
      :visible="modalFormsVisibility.aliasTransaction"
      :title="aliasModalTitle"
      @close="closeModal('aliasTransaction')"
    >
      <template v-slot:form>
        <FormAliasTransaction
          :namespace-id="modalFormsProps.namespaceId"
          :alias-target="modalFormsProps.aliasTarget"
          :alias-action="modalFormsProps.aliasAction"
        />
      </template>
    </ModalFormWrap>

    <ModalFormWrap
      v-if="modalFormsVisibility.extendNamespaceDurationTransaction"
      :visible="modalFormsVisibility.extendNamespaceDurationTransaction"
      title="modal_title_extend_namespace_duration"
      @close="closeModal('extendNamespaceDurationTransaction')"
    >
      <template v-slot:form>
        <FormExtendNamespaceDurationTransaction :namespace-id="modalFormsProps.namespaceId" />
      </template>
    </ModalFormWrap>

    <ModalFormWrap
      v-if="modalFormsVisibility.mosaicSupplyChangeTransaction"
      :visible="modalFormsVisibility.mosaicSupplyChangeTransaction"
      title="modal_title_mosaic_supply_change"
      @close="closeModal('mosaicSupplyChangeTransaction')"
    >
      <template v-slot:form>
        <FormMosaicSupplyChangeTransaction :namespace-id="modalFormsProps.mosaicId" />
      </template>
    </ModalFormWrap>
  </div>
</template>

<script lang="ts">
import { TableDisplayTs } from './TableDisplayTs'

export default class TableDisplay extends TableDisplayTs {}
</script>

<style scoped lang="less">
@import "./TableDisplay.less";
</style>
