<template>
  <div class="transaction-details-wrapper">
    <TransactionInfoTemplate :dialogDetailMap="transaction.dialogDetailMap"></TransactionInfoTemplate>
    <!-- inner transaction -->
    <div class="inner-transaction-container" v-if="transaction.formattedInnerTransactions">
      <span class=" title"> {{$t('inner_transaction')}}</span>
      <Collapse v-model="currentPanel">
        <div
                v-for="(innerTransaction, index) in transaction.formattedInnerTransactions"
                :key="index"
                class="inner_transaction">

          <Panel :name="index + ''">
            {{$t(innerTransaction.dialogDetailMap.transfer_type)}}
            <div slot="content">
              <TransactionInfoTemplate :dialogDetailMap="innerTransaction.dialogDetailMap"></TransactionInfoTemplate>
            </div>
          </Panel>
        </div>
      </Collapse>
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
