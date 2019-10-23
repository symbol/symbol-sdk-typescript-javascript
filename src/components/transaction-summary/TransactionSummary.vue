<template>
    <div class="transaction_preview">
    <div class="dash_board_dialog text_select">
        <div class="transfer_type ">
            <span class="title">{{$t('transfer_type')}}</span>
            <span class="value overflow_ellipsis">{{formattedTransaction.dialogDetailMap
                ? $t(formattedTransaction.dialogDetailMap.transfer_type) :'-'}}
            </span>
        </div>
        <div>
            <div
                v-for="(value, key) in formattedTransaction.dialogDetailMap"
                :key="key"
                class="other_info"
            >
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

                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosignatories">
                <CosignatoriesTable :cosignatories="value" />
                </div>
                <!-- @MODAL: Do a table for restrictions -->
                <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.namespace">
                <span class="title">{{$t(key)}}</span>
                <span class="value overflow_ellipsis" v-if="value">
                    {{ getNamespaceNameFromNamespaceId(value, $store) }}
                </span>
                <span class="no_data" v-else>{{$t('no_data')}}</span>
                </div>
            </div>
            <!-- inner transaction -->
            <div v-if="formattedTransaction.formattedInnerTransactions">
                <span class=" title"> {{$t('inner_transaction')}}</span>
                <div
                        v-for="(innerTransaction, index) in formattedTransaction.formattedInnerTransactions"
                        :key="index"
                        class="inner_transaction"
                >
                <span
                        class="pointer value"
                        @click="showInnerDialog(innerTransaction)"
                >
                    {{$t(innerTransaction.dialogDetailMap.transfer_type)}}
                </span>
                </div>
            </div>
        </div>

        </div>

        <Modal
                :title="$t('transaction_detail')"
                v-model="isShowInnerDialog"
                :transfer="false"
                class-name="dash_board_dialog inner_dialog scroll"
        >
        <div class="transfer_type ">
            <span class="title overflow_ellipsis">{{$t('transfer_type')}}</span>
            <span class="value overflow_ellipsis">{{currentInnerTransaction.dialogDetailMap
                ? $t(currentInnerTransaction.dialogDetailMap.transfer_type) :'-'}}</span>
        </div>
        <div
            v-for="(value, key) in currentInnerTransaction.dialogDetailMap"
            :key="key"
            class="other_info"
        >
            <div v-if="key !== 'transfer_type' && !(key in SpecialTxDetailsKeys)">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis" v-if="value">
                {{key in TxDetailsKeysWithValueToTranslate ? $t(value) : value }}
            </span>
            <span class="no_data" v-else>{{$t('no_data')}}</span>
            </div>

            <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.mosaics">
            <span class="title">{{$t(key)}}</span>
            <MosaicTable :tableData="renderMosaicsToTable(value)" />
            </div>

            <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.cosignatories">
            <span class="title">{{$t(key)}}</span>
            <CosignatoriesTable :cosignatories="value" />
            </div>
            <!-- @MODAL: Do a table for restrictions -->
            <div class="mosaic_info" v-if="key === SpecialTxDetailsKeys.namespace">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis" v-if="value">
                {{ getNamespaceNameFromNamespaceId(value, $store) }}
            </span>
            <span class="no_data" v-else>{{$t('no_data')}}</span>
            </div>
        </div>
        </Modal>
    </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionSummaryTs} from '@/components/transaction-summary/TransactionSummaryTs.ts'

    export default class TransactionSummary extends TransactionSummaryTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionSummary.less";
</style>
