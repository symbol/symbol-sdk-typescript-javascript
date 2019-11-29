<template>
  <div class="transaction-info-template-wrapper">
    <div class="transaction-info-title clear">
      <span>{{$t('sender')}}</span>
      <span>{{$t('to_or_action')}}</span>
    </div>

    <div class="transaction-details-container scroll">
      <div
        v-for="(t, index) in transactionDetails"
        :key="index"
        class="radius sub-transaction-details"
      >
        <div class="first-line">
          <span>{{ t.from ? formatSenderOrRecipient(t.from, $store) : getFrom() }}</span>
          <span v-if="t.transaction_type">{{ formatSenderOrRecipient(t.aims, $store) }}</span>
          <span v-else>{{$t(t.transaction_type)}}</span>
        </div>

        <div v-if="t.mosaics" class="asset-item">
          <span>{{$t('assets')}}:</span>
          <div
            v-for="(a, index) in renderMosaicsAndReturnArray(t.mosaics, $store)"
            :key="index"
            class="modify-item"
          >
            <div v-if="!a.name">
              <span class="title">{{$t('hex')}}</span>
              {{a.hex}}
            </div>
            <div v-else>
              <span class="title">{{$t('hex')}}</span>
              {{a.hex}} [{{a.name}}]
            </div>
            <div>
              <span class="title">{{$t('amount')}}</span>
              {{a.amount}}
            </div>
          </div>
        </div>

        <div v-if="t.cosignatories" class="asset-item">
          <span>{{$t('cosignatories')}}:</span>
          <div
            class="modify-item"
            v-for="(item, index) in t.cosignatories.modifications"
            :key="index"
          >
            <div>
              <span class="title">{{$t('publicKey')}}:&nbsp;</span>
              {{item.cosignatory.publicKey}}
            </div>
            <div>
              <span class="title">{{$t('address')}}:&nbsp;</span>
              {{item.cosignatory.address.pretty()}}
            </div>
            <div>
              <span class="title">{{$t('type')}}:&nbsp;</span>
              {{item.addOrRemove}}
            </div>
          </div>
        </div>

        <span v-for="(value, key) in t" :key="key">
          <span class="other-info" v-if="!unusedAttributesList.find(item => item === key) && value !== ''">
            <span>{{$t(key)}}:&nbsp;</span>
            <span>{{value}}</span>
          </span>
          <span class="other-info" v-if="key === 'namespace'">
            <span>{{$t(key)}}:&nbsp;</span>
            <span>{{getNamespaceNameFromNamespaceId(value, $store)}}</span>
          </span>
        </span>

        <div v-if="cosignedBy && cosignedBy.length" class="asset-item">
          <span>{{$t('cosigned_by')}}:&nbsp;</span>
          <div class="modify-item" v-for="(item, index) in cosignedBy" :key="index">
            <div>
              <span class="title">{{index + 1}}:&nbsp;</span>
              <span class="cosigner_address">{{item}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {TransactionInfoTemplateTs} from '@/components/transaction-details/transaction-info-template/TransactionInfoTemplateTs.ts';
import "./TransactionInfoTemplate.less";
export default class TransactionInfoTemplate extends TransactionInfoTemplateTs {}
</script>
