<template>
  <div>
    <Modal
            v-model="show"
            v-if="activeTransaction"
            :title="$t('transaction_detail')"
            :transfer="false"
            class-name="dash_board_dialog scroll text_select"
    >
      <div class="transfer_type ">
        <span class="title">{{$t('transfer_type')}}</span>
        <span class="value overflow_ellipsis">{{activeTransaction.dialogDetailMap
            ? $t(activeTransaction.dialogDetailMap.transfer_type) :'-'}}
        </span>
      </div>
      <div>
        <div
                v-for="(value, key) in activeTransaction.dialogDetailMap"
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
        <div v-if="activeTransaction.formattedInnerTransactions">
          <span class=" title"> {{$t('inner_transaction')}}</span>
          <div
                  v-for="(innerTransaction, index) in activeTransaction.formattedInnerTransactions"
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
    </Modal>


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
      <div>
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
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionModalTs} from '@/components/transaction-modal/TransactionModalTs.ts'

    export default class TransactionModal extends TransactionModalTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionModal.less";
</style>
