<template>
  <div class="transaction-info-template-wrapper">
    <div class="transfer_type">
      <span class="info-title overflow_ellipsis">{{$t('transfer_type')}}</span>
      <span
        class="value overflow_ellipsis"
      >{{dialogDetailMap ? $t(dialogDetailMap.transfer_type) :'-'}}</span>
    </div>

    <div v-for="(value, key) in dialogDetailMap" :key="key">
      <div v-if="value && key !== 'transfer_type'" class="other_info">
        <div v-if="!(key in SpecialTxDetailsKeys)">
          <span class="info-title">{{$t(key)}}</span>
          <span
            class="value text_select"
            v-if="value"
          >{{key in TxDetailsKeysWithValueToTranslate ? $t(value) : value }}</span>
          <span class="no_data" v-else>{{$t('no_data')}}</span>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.hash">
          <span class="info-title">{{$t(key)}}</span>
          <a target="_blank" :href="getExplorerUrl(value)">{{value}}</a>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.mosaics && value.length">
          <span class="info-title">{{$t(key)}}</span>
          <MosaicTable :tableData="renderMosaicsToTable(value)" />
        </div>

        <div
          class="mosaic_info"
          v-if="key === SpecialTxDetailsKeys.from || key === SpecialTxDetailsKeys.aims"
        >
          <span class="info-title">{{$t(key)}}</span>
          <span
            class="value overflow_ellipsis"
          >{{ value instanceof NamespaceId ? getNamespaceNameFromNamespaceId(value.id.toHex(), $store) : value }}</span>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosignatories">
          <CosignatoriesTable :modifications="value.modifications" />
        </div>
        <!-- @MODAL: Do a table for restrictions -->
        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.namespace">
          <span class="info-title">{{$t(key)}}</span>
          <span
            class="value overflow_ellipsis"
            v-if="value"
          >{{ getNamespaceNameFromNamespaceId(value, $store) }}</span>
        </div>

        <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosigned_by && value.length">
          <span class="info-title">{{$t(key)}}</span>
          <ul>
            <li v-for="address in value" :key="`c${address}`">{{ address }}</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import TransactionInfoTemplateTs from "./TransactionInfoTemplateTs";
import "./TransactionInfoTemplate.less";
export default class TransactionInfoTemplate extends TransactionInfoTemplateTs {}
</script>
<style scoped lang="less">
</style>
