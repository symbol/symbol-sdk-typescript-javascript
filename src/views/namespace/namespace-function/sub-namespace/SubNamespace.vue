<template>
  <div class="namespace_transaction_container secondary_page_animate" >
    <div class="right_panel">
      <DisabledForms></DisabledForms>
      <form @submit.prevent="validateForm('sub-namespace')">
        <div class="namespace_transaction" @keyup.enter="submit">
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
            <span class="key">{{$t('parent_namespace')}}</span>
            <span class="value">
            <ErrorTooltip fieldName="parent_namespace" placementOverride="right">
              <Select
                      :placeholder="$t('select_parent_namespace')"
                      data-vv-name="parent_namespace"
                      v-validate="'required'"
                      v-model="formItems.rootNamespaceName"
                      class="select"
                      :data-vv-as="$t('parent_namespace')"
              >
                  <Option v-for="item in activeNamespaceList" :value="item.value"
                          :key="item.value">{{ item.label }}</Option>
              </Select>
            </ErrorTooltip>
            </span>
          </div>

          <div class="form_item">
            <span class="key">{{$t('Subspace')}}</span>
            <span class="value">
              <ErrorTooltip fieldName="Subspace" placementOverride="right">
                <span class="value">
                  <input
                          v-focus
                          data-vv-name="Subspace"
                          v-model="formItems.subNamespaceName"
                          v-validate="standardFields.subNamespaceName.validation"
                          :data-vv-as="$t('Subspace')"
                          type="text"
                          :placeholder="$t('Input_space_name')"
                  />
                </span>
              </ErrorTooltip>
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

          <div class="create_button pointer" @click="submit()">
            {{$t('create')}}
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {SubNamespaceTs} from '@/views/namespace/namespace-function/sub-namespace/SubNamespaceTs.ts'

    export default class SubNamespace extends SubNamespaceTs {

    }
</script>
<style scoped lang="less">
  @import "./SubNamespace.less";
</style>
