<template>
    <div>
        <div class="transfer_type ">
            <span class="title overflow_ellipsis">{{$t('transfer_type')}}</span>
            <span class="value overflow_ellipsis">{{transaction.dialogDetailMap
                ? $t(transaction.dialogDetailMap.transfer_type) :'-'}}
            </span>
        </div>
        <div
            v-for="(value, key) in transaction.dialogDetailMap"
            :key="key"
            class="other_info"
        >
            <div v-if="value">
                <div v-if="key !== 'transfer_type' && !(key in SpecialTxDetailsKeys)">
                    <span class="title">{{$t(key)}}</span>
                    <span class="value overflow_ellipsis text_select" v-if="value">
                        {{key in TxDetailsKeysWithValueToTranslate ? $t(value) : value }}
                    </span>

                    <span class="no_data" v-else>{{$t('no_data')}}</span>
                </div>

                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.mosaics">
                    <span class="title">{{$t(key)}}</span>
                    <MosaicTable :tableData="renderMosaicsToTable(value)" />
                </div>

                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.from || key === SpecialTxDetailsKeys.aims">
                    <span class="title">{{$t(key)}}</span>
                    <span class="value overflow_ellipsis">
                        {{ value instanceof NamespaceId ? getNamespaceNameFromNamespaceId(value.id.toHex(), $store) : value }}
                    </span>
                </div>

                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosignatories">
                    <CosignatoriesTable :cosignatories="value" />
                </div>
                <!-- @MODAL: Do a table for restrictions -->
                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.namespace">
                    <span class="title">{{$t(key)}}</span>
                    <span class="value overflow_ellipsis" v-if="value">
                        {{ getNamespaceNameFromNamespaceId(value, $store) }}
                    </span>
                </div>
            </div>
        </div>


        <!-- inner transaction -->
        <div v-if="transaction.formattedInnerTransactions">
            <span class=" title"> {{$t('inner_transaction')}}</span>
            <div
                v-for="(innerTransaction, index) in transaction.formattedInnerTransactions"
                :key="index"
                class="inner_transaction"
            >
            <span
                class="pointer value"
                @click="$emit('innerTransactionClicked', innerTransaction)"
            >
                {{$t(innerTransaction.dialogDetailMap.transfer_type)}}
            </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import {TransactionDetailsTs} from './TransactionDetailsTs'
    export default class TransactionDetails extends TransactionDetailsTs {}
</script>

<style scoped lang="less">
  @import "TransactionDetails.less";
</style>
