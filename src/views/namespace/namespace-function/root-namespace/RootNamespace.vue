<template>
  <div class="namespace_transaction_container secondary_page_animate">
    <div class="right_panel">
      <DisabledForms></DisabledForms>
      <form @submit.prevent="validateForm('root-namespace')">
        <div class="namespace_transaction"  @keyup.enter="submit">
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
            <ErrorTooltip fieldName="namespaceName" placementOverride="right">
              <span class="value">
                <input
                        v-focus
                        data-vv-name="namespaceName"
                        v-model="formItems.rootNamespaceName"
                        v-validate="standardFields.namespaceName.validation"
                        :data-vv-as="$t('root_namespace')"
                        type="text"
                        :placeholder="$t('New_root_space')"
                />
              </span>
            </ErrorTooltip>
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
            <ErrorTooltip fieldName="duration" placementOverride="right">
              <span class="value">
                <input
                        data-vv-name="duration"
                        v-model="formItems.duration"
                        v-validate="`required|${standardFields.namespaceDuration.validation}`"
                        :data-vv-as="$t('duration')"
                        type="text"
                        :placeholder="$t('duration')"
                />
                <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
              </span>
            </ErrorTooltip>
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

          <div class="create_button pointer" @click="submit">
            {{$t('create')}}
          </div>
        </div>
      </form>
    </div>    
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
