<template>
  <div class="namespace_transaction_container secondary_page_animate">
    <div class="right_panel">
      <div class="namespace_transaction">
        <div class="form_item">
          <span class="key">{{$t('account')}}</span>
          <span
            v-if="!hasMultisigAccounts"
            class="value text_select"
          >{{ formatAddress(wallet.address) }}
          </span>
          <Select
            v-if="hasMultisigAccounts"
            :placeholder="$t('publicKey')"
            v-model="formItems.multisigPublicKey"
            class="fee-select"
          >
            <Option
              v-for="item in multisigPublicKeyList"
              :value="item.publicKey" :key="item.publicKey"
            >{{ item.address }}
            </Option>
          </Select>
        </div>

        <div class="form_item">
          <span class="key">{{$t('root_namespace')}}</span>
          <span class="value">
                       <input type="text" v-model="formItems.rootNamespaceName" :placeholder="$t('New_root_space')">
                   </span>
          <div class="tips">
            <div>
              {{$t('namespace_tips_key_1')}}
              <span class="red">{{$t('namespace_tips_value_1')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_2')}}
              <span class="red">{{$t('namespace_tips_value_2')}}</span>
            </div>
            <div>
              {{$t('namespace_tips_key_3')}}
            </div>
          </div>
        </div>

        <div class="form_item duration_item">
          <span class="key">{{$t('duration')}}</span>
          <span class="value">
             <input v-model="formItems.duration" type="text" @input="changeXEMRentFee" :placeholder="$t('duration')">
            <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
         </span>
          <div class="tips">
            {{$t('namespace_duration_tip_1')}}
          </div>
        </div>

        <div class="form_item XEM_rent_fee" v-if="false">
          <span class="key">{{$t('rent')}}</span>
          <span class="value">{{Number(formItems.duration)}}{{ networkCurrency.ticker }}</span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('fee')}}</span>
          <Select
                  class="fee-select"
                  data-vv-name="fee"
                  v-model="formItems.feeSpeed"
                  v-validate="'required'"
                  :data-vv-as="$t('fee')"
                  :placeholder="$t('fee')"
          >
            <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
              {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
            </Option>
          </Select>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div :class="['create_button ',isCompleteForm?'pointer':'not_allowed']" @click="createTransaction">
          {{$t('create')}}
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog"
                   @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"
                   :transactionDetail="transactionDetail"
                   :transactionList="transactionList"
                   :otherDetails="otherDetails"
    />
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {RootNamespaceTs} from '@/views/namespace/namespace-function/root-namespace/RootNamespaceTs.ts'

    export default class RootNamespace extends RootNamespaceTs {

    }
</script>
<style scoped lang="less">
  @import "./RootNamespace.less";
</style>
