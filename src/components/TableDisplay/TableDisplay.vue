<template>
  <div class="table-container">
    <div class="upper-section-container">
      <div class="table-title-container section-title">
        <slot name="table-title" />
        <div class="user-operation">
          <Checkbox v-model="showExpired">
            <span v-show="assetType === 'mosaic'">{{ $t('show_expired_mosaics') }}</span>
            <span v-show="assetType === 'namespace'">{{ $t('show_expired_namespaces') }}</span>
          </Checkbox>
          <span @click="onRefresh"><Icon :class="{'animation-rotate':isRefreshing}" type="ios-sync" /></span>
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
        v-show="loading" size="large" fix
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
      <div v-else class="no-data-outer-container">
        <div class="no-data-message-container">
          <div>
            {{ assetType === 'mosaic'
              ? $t('no_data_mosaics')
              : $t('no_data_namespaces') 
            }}
          </div>
        </div>
        <div class="no-data-inner-container">
          <div v-for="item in nodata" :key="item">
            &nbsp;
          </div>
        </div>
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
          :asset-type="assetType"
          @on-confirmation-success="closeModal('aliasTransaction')"
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
        <FormExtendNamespaceDurationTransaction
          :namespace-id="modalFormsProps.namespaceId"
          @on-confirmation-success="closeModal('extendNamespaceDurationTransaction')"
        />
      </template>
    </ModalFormWrap>

    <ModalFormWrap
      v-if="modalFormsVisibility.mosaicSupplyChangeTransaction"
      :visible="modalFormsVisibility.mosaicSupplyChangeTransaction"
      title="modal_title_mosaic_supply_change"
      @close="closeModal('mosaicSupplyChangeTransaction')"
    >
      <template v-slot:form>
        <FormMosaicSupplyChangeTransaction
          :mosaic-hex-id="modalFormsProps.mosaicId.toHex()"
          @on-confirmation-success="closeModal('mosaicSupplyChangeTransaction')"
        />
      </template>
    </ModalFormWrap>
  </div>
</template>

<script lang="ts">
import { TableDisplayTs } from './TableDisplayTs'
export default class TableDisplay extends TableDisplayTs {}
import './TableDisplay.less'
</script>
