<template>
  <div class="transaction-info-template-wrapper">

    <div class="transaction-info-title clear">
      <span>{{$t('sender')}}</span>
      <span>{{$t('to_or_action')}}</span>
    </div>

    <div class="transaction-details-container scroll">
      <div v-for="t in transactionDetails" class="radius sub-transaction-details">

        <div class="first-line">
          <span>{{t.from||decryptedAddress(t.self)}}</span>
          <span v-if="t.transaction_type =='payment' ||t.transaction_type == 'receipt'">{{t.aims || t.self}}</span>
          <span v-else>{{$t(t.transaction_type)}} </span>
        </div>

        <div v-if="t.mosaics" class="asset-item">
          <span>{{$t('assets')}}: </span>
          <div v-for="(a) in renderMosaicsToTable(t.mosaics)" class=" modify-item">
            <div v-if="!a.name"><span class="title">{{$t('hex')}}</span>{{a.hex}}</div>
            <div v-else><span class="title">{{$t('hex')}}</span>{{a.hex}} [{{a.name}}]</div>
            <div><span class="title">{{$t('amount')}}</span>{{a.amount}}</div>
          </div>
        </div>

          <div v-if="t.cosignatories" class="asset-item">
            <span>{{$t('cosignatories')}}: </span>
            <div class="modify-item" v-for="item in t.cosignatories.modifications">
              <div><span class="title">{{$t('publicKey')}}:</span>{{item.cosignatory.publicKey}}</div>
              <div><span class="title">{{$t('address')}}:</span>{{item.cosignatory.address.plain()}}</div>
              <div><span class="title">{{$t('type')}}:</span>{{item.addOrRemove}}</div>
            </div>
          </div>

          <span v-for="(value,key) in t">
        <span class="other-info" v-if="!unusedAttributesList.find(item=>item == key)">
          <span>{{$t(key)}}: </span>
          <span>{{value}}</span>
        </span>
      </span>
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
<style>
</style>
