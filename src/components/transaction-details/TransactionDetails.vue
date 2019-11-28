<template>
  <div class="transaction-details-wrapper">
    <div class="top-container">

      <div v-if="transaction.txHeader.hash" class="transaction-hash top-transaction-item">
        <span class="transaction-info-title">{{$t('hash')}}：</span>
        <span class="bolder">
          <a target="_blank" :href="formatExplorerUrl(transaction.txHeader.hash)">{{transaction.txHeader.hash}}</a>
        </span>
      </div>

      <div class="top-transaction-item transaction-status">
        <span class="transaction-info-title">{{$t('status')}}：</span>
        <span class="bolder">{{transaction.isTxConfirmed?'confirmed':'unconfirmed'}}</span>
      </div>

      <div class="top-transaction-item">
      <span class="transaction-type">
        <span class="transaction-info-title">{{$t('transaction_type')}}：</span>
        <span class="bolder">{{$t(transaction.txHeader.tag)}}</span>
      </span>
        <span class="transaction-fee">
        <span class="transaction-info-title">{{$t('fee')}}：</span>
        <span class="bolder">{{transaction.txHeader.fee}}XEM</span>
      </span>
      </div>
      <div class="top-transaction-item">

        <span class="transaction-height">
          <span class="transaction-info-title">{{$t('block_height')}}：</span>
          <span class="bolder">{{transaction.txHeader.block||'unconfirmed'}}</span>
        </span>

        <span v-if="transaction.txHeader.block">
          <span class="transaction-info-title">{{$t('date')}}：</span>
          <span class="bolder">{{transaction.txHeader.time}}</span>
        </span>

        <span v-else class="transaction-deadline">
          <span class="transaction-info-title">{{$t('deadline')}}：</span>
          <span class="bolder">{{transaction.rawTx.deadline.value.toLocalDate()}} {{transaction.rawTx.deadline.value.toLocalTime()}}</span>
        </span>
      </div>

      <!--      todo add cosign qr info-->
      <!--      <img @click="downloadQR" id="qrImg" class="qr-image" v-if="qrCode$" :src="qrCode$">-->
    </div>

    <div class="bottom-transaction-details">
      <TransactionInfoTemplate :transactionDetails="transactionDetails"></TransactionInfoTemplate>
    </div>
  </div>
</template>

<script lang="ts">
    import {TransactionDetailsTs} from './TransactionDetailsTs'
    import "./TransactionDetails.less"

    export default class TransactionDetails extends TransactionDetailsTs {
    }
</script>

<style scoped lang="less">
</style>
