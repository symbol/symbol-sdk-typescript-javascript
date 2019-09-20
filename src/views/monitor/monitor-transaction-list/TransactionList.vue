<template>
  <div class="transaction-list-container radius">
    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog scroll">
      <Spin v-if="isLoadingModalDetailsInfo" size="large" fix class="absolute"></Spin>
      <div class="transfer_type ">
        <span class="title">{{$t('transfer_type')}}</span>
        <span class="value overflow_ellipsis">
          {{transactionDetails.dialogDetailMap ? $t(transactionDetails.dialogDetailMap.transfer_type) :'-'}}
        </span>
      </div>
      <div>
        <div
          v-for="(value, key) in transactionDetails.dialogDetailMap"
          :key="key"
          class="other_info"
        >
          <div v-if="key !== 'transfer_type' && key !== 'mosaic'">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis">{{value}}</span>
          </div>
          <div v-if="key === 'mosaic'">
            <span class="title">{{$t(key)}}</span>
            <span class="value overflow_ellipsis">{{ renderMosaics(value, mosaicList, currentXem) }}
            </span>
          </div>
        </div>
        <!-- inner transaction -->
        <div v-if="transactionDetails.formattedInnerTransactions">
          <span class=" title"> {{$t('inner_transaction')}}</span>
          <div
            v-for="(innerTransaction, index) in transactionDetails.formattedInnerTransactions"
            :key="index"
            class="inner_transaction"
          >
            <span class="pointer value" @click="showInnerDialog(innerTransaction)">{{$t(innerTransaction.dialogDetailMap.transfer_type)}}</span>
          </div>
        </div>
      </div>
    </Modal>

    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowInnerDialog"
            :transfer="false"
            class-name="dash_board_dialog inner_dialog scroll">

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
          <div v-if="key !=='transfer_type'">
            <span class="title overflow_ellipsis">{{$t(key)}}</span>
            <span class="value overflow_ellipsis">{{value}}</span>
          </div>
        </div>
      </div>
    </Modal>

    <div class="bottom_transactions radius scroll" ref="bottomTransactions">
      <div class="splite_page">
        <span>{{$t('total')}}：{{transactionList.length}} {{$t('data')}}</span>
        <Page @on-change="changePage" :total="transactionList.length" class="page_content"/>
      </div>

      <div class="label_page">
        <span class="page_title">{{$t('transaction_record')}}</span>
      </div>

      <div class="table_container">
        <div class="all_transaction">
          <div class="table_head">
            <div class="col2-header"><span>{{$t('from_to_action')}}</span></div>
            <div class="col3-header"><span>{{$t('amount_asset')}}</span></div>
            <div class="col4-header"><span>{{$t('confirmations_height')}}</span></div>
            <div class="col5-header"><span>{{$t('hash_deadline')}}</span></div>
          </div>
          <div class="confirmed_transactions">
            <Spin v-if="transactionsLoading" size="large" fix class="absolute"></Spin>
            <div class="table_body hide_scroll" ref="confirmedTableBody">
              <div
                class="table_item pointer"
                @click="showDialog(c,true)"
                v-for="(c, index) in slicedTransactionList"
                :key="index"
              >
              <!-- FIRST COLUMN -->
              <img class="mosaic_action" :src="c.icon" alt="" />

              <!-- SECOND COLUMN -->
              <div class="col2">
                <span
                  class="col2-item"
                >
                    {{ c.rawTx.signer.address.plain() }}
                </span>
                <span
                  v-if="c.rawTx.type === TransactionType.TRANSFER"
                  class="col2-item bottom"
                >
                    -> {{ c.rawTx.recipient.address }}
                </span>
                <span
                  v-if="c.rawTx.type !== TransactionType.TRANSFER"
                  class="col2-item bottom tag"
                >
                    -> {{ c.txHeader.tag }}
                </span>
              </div>

              <!-- THIRD COLUMN -->
              <div class="col3">
                <span
                  :class="[!c.isReceipt ? 'green' : 'red', 'overflow_ellipsis']"
                  v-if="c.rawTx.type === TransactionType.TRANSFER"
                >
                    {{ renderMosaics(c.rawTx.mosaics, mosaicList, currentXem) }}
                </span>
                <span
                  class="red"
                  v-if="c.rawTx.type !== TransactionType.TRANSFER"
                >
                    - {{ c.txHeader.fee }}
                </span>
              </div>

              <!-- FOURTH COLUMN -->
              <div class="col4">
                <span v-if="!c.isTxUnconfirmed" class="col4">
                  {{ renderHeightAndConfirmation(c.txHeader.block) }}
                </span>
                <span v-if="c.isTxUnconfirmed" class="col4">
                  {{ $t('unconfirmed') }}
                </span>
              </div>

              <!-- FIFTH COLUMN -->
              <div class="col5">
                <span class="item"> {{ miniHash(c.txHeader.hash) }} </span>
                <span class="item bottom">{{c.txHeader.time}}</span>
              </div>

              <!-- SIXTH COLUMN -->
              <div class="col6">
                <img
                  v-if="c.isTxUnconfirmed"
                  src="@/common/img/monitor/dash-board/dashboardUnconfirmed.png"
                  class="expand_mosaic_info"
                />
                <img
                  v-if="!c.isTxUnconfirmed"
                  src="@/common/img/monitor/dash-board/dashboardConfirmed.png"
                  class="expand_mosaic_info"
                />
                </div>
                <div class="no_data" v-if="!transactionList.length">
                  {{$t('no_confirmed_transactions')}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {TransactionListTs} from '@/views/monitor/monitor-transaction-list/TransactionListTs.ts'

    export default class TransactionList extends TransactionListTs {

    }
</script>

<style scoped lang="less">
  @import "TransactionList.less";
</style>
