<template>
  <div class="transaction-info-template-wrapper">
    <div class="transfer_type ">
      <span class="title overflow_ellipsis">{{$t('transfer_type')}}</span>
      <span class="value overflow_ellipsis">{{dialogDetailMap ? $t(dialogDetailMap.transfer_type) :'-'}}</span>
    </div>

    <div
            v-for="(value, key) in dialogDetailMap"
            :key="key"
            class="other_info">
      <div v-if="value">

        <div v-if="key !== 'transfer_type' && !(key in SpecialTxDetailsKeys)">
          <span class="title">{{$t(key)}}</span>
          <span class="value text_select" v-if="value"> {{key in TxDetailsKeysWithValueToTranslate ? $t(value) : value }} </span>
          <span class="no_data" v-else>{{$t('no_data')}}</span>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.hash">
          <span class="title">{{$t(key)}}</span>
          <a target="_blank" :href="getExplorerUrl(value)">{{value}}</a>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.mosaics && value.length">
          <span class="title">{{$t(key)}}</span>
          <MosaicTable :tableData="renderMosaicsToTable(value)"/>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.from || key === SpecialTxDetailsKeys.aims">
          <span class="title">{{$t(key)}}</span>
          <span class="value overflow_ellipsis"> {{ value instanceof NamespaceId ? getNamespaceNameFromNamespaceId(value.id.toHex(), $store) : value }} </span>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosignatories">
          <CosignatoriesTable :cosignatories="value"/>
        </div>
        <!-- @MODAL: Do a table for restrictions -->
        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.namespace">
          <span class="title">{{$t(key)}}</span>
          <span class="value overflow_ellipsis" v-if="value"> {{ getNamespaceNameFromNamespaceId(value, $store) }} </span>
        </div>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import TransactionInfoTemplateTs from './TransactionInfoTemplateTs'
    import "./TransactionInfoTemplate.less"
    export default class TransactionInfoTemplate extends TransactionInfoTemplateTs {


    }
</script>
<style scoped lang="less">
</style>
