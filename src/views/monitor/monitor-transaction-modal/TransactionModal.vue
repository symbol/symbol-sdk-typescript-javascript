<template>
  <div>
    <Modal
            v-model="show"
            v-if="activeTransaction"
            :title="$t('transaction_detail')"
            :transfer="false"
            class-name="dash_board_dialog scroll"
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
          <div v-if="key !== 'transfer_type' && key !== 'mosaic'">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis text_select" v-if="value">{{value}}</span>
            <span class="no_data" v-else>{{$t('no_data')}}</span>
          </div>
          <div class="mosaic_info" v-if="key === 'mosaic'">
            <!--            TODO NEED BE SAME WITH XXX-->

            <span class="title">{{$t(key)}}</span>
            <MosaicTable :tableData="renderMosaicsToTable(value)"></MosaicTable>
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
                class="other_info"
                :key="key"
        >
          <div v-if="key !== 'transfer_type' && key !== 'mosaic'">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis" v-if="value">{{value}}</span>
            <span v-else>{{$t('no_data')}}</span>
          </div>
          <div class="mosaic_info" v-if="key === 'mosaic'">
            <span class="title">{{$t(key)}}</span>
            <MosaicTable :tableData="renderMosaicsToTable(value)"></MosaicTable>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionModalTs} from '@/views/monitor/monitor-transaction-modal/TransactionModalTs.ts'

    export default class TransactionModal extends TransactionModalTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionModal.less";
</style>
