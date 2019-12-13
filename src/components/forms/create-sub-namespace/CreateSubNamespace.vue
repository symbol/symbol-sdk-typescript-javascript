<template>
  <div class="namespace_transaction_container secondary_page_animate">
    <DisabledForms></DisabledForms>
    <div class="right_panel">
      <div class="left-root-namespace-form">
        <form onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="namespace_transaction">
            <div class="form_item">
              <span class="key">{{$t('account')}}</span>
              <span
                      v-if="!hasMultisigAccounts"
                      class="value text_select"
              >{{ formatAddress(wallet.address) }}
            </span>
              <SignerSelector v-if="hasMultisigAccounts" v-model="formItems.multisigPublicKey"/>
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
                          v-validate="validation.subNamespaceName"
                          :data-vv-as="$t('Subspace')"
                          type="text"
                          :placeholder="$t('Input_space_name')"
                  />
                </span>
              </ErrorTooltip>
            </span>

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

      <div class="right-root-namespace-tips">
        <div class="tips">
          <p class="right_container_head">{{$t('root_namespace_name')}}</p>
          <p class="second_head">{{$t('namespace_name')}}</p>
          <p> {{$t('namespace_tips_key_1')}} <span class="green"> {{$t('namespace_tips_value_1')}} </span></p>
          <p> {{$t('namespace_tips_key_2')}} <span class="green"> {{$t('namespace_tips_value_2')}} </span></p>
          <p> {{$t('namespace_tips_key_3')}}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
    // @ts-ignore
    import {CreateSubNamespaceTs} from '@/components/forms/create-sub-namespace/CreateSubNamespaceTs.ts'

    export default class CreateSubNamespace extends CreateSubNamespaceTs {
    }
</script>
<style scoped lang="less">
  @import "./CreateSubNamespace.less";
</style>
