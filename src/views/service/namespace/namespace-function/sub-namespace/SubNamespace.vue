<template>
  <div class="namespace_transaction_container">
    <div class="left_switch_type">
      <div class="type_list_item " v-for="(b,index) in typeList">
        <span :class="['name',b.isSelected?'active':'','pointer']" @click="switchType(index)">{{$t(b.name)}}</span>
      </div>
    </div>

    <div class="right_panel">
      <div class="namespace_transaction">
        <div class="form_item">
          <span class="key">{{$t('account')}}</span>
          <span class="value" v-if="typeList[0].isSelected">{{formatAddress(getWallet.address)}}</span>
          <Select v-if="typeList[1].isSelected" :placeholder="$t('publickey')" v-model="multisigPublickey"
                  class="select">
            <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">{{ item.label }}
            </Option>
          </Select>
        </div>


        <div class="form_item">
          <span class="key">{{$t('parent_namespace')}}</span>
          <span class="value">
              <Select :placeholder="$t('select_parent_namespace')" v-model="form.rootNamespaceName" class="select">
                  <Option v-for="item in namespaceList" v-if="item.levels < 3" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
          </span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('Subspace')}}</span>
          <span class="value">
              <input type="text" v-model="form.subNamespaceName" :placeholder="$t('Input_space_name')">
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

        <div class="form_item">
          <span class="key">{{$t('inner_fee')}}</span>
          <span class="value">
              <input type="text" v-model="form.innerFee" :placeholder="$t('undefined')">
            <span class="end_label">gas</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div class="form_item" v-if="typeList[1].isSelected">
          <span class="key">{{$t('bonded_fee')}}</span>
          <span class="value">
              <input type="text" v-model="form.bondedFee" :placeholder="$t('undefined')">
            <span class="end_label">gas</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div class="form_item" v-if="typeList[1].isSelected">
          <span class="key">{{$t('lock_fee')}}</span>
          <span class="value">
              <input type="text" v-model="form.lockFee" :placeholder="$t('undefined')">
            <span class="end_label">gas</span>
          </span>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div v-if="typeList[0].isSelected" :class="['create_button',isCompleteForm?'pointer':'not_allowed']"
             @click="createTransaction">
          {{$t('create')}}
        </div>
      </div>
    </div>
    <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"></CheckPWDialog>

  </div>
</template>

<script lang="ts">
    import {SubNamespaceTs} from './SubNamespaceTs'

    export default class SubNamespace extends SubNamespaceTs {

    }
</script>
<style scoped lang="less">
  @import "./SubNamespace.less";
</style>
