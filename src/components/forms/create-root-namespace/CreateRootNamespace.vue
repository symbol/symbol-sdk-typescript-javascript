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
              <span class="key">{{$t('name')}}</span>
              <ErrorTooltip fieldName="namespaceName" placementOverride="right">
              <span class="value">
                <input
                        v-focus
                        data-vv-name="namespaceName"
                        v-model="formItems.rootNamespaceName"
                        v-validate="validation.namespaceName"
                        :data-vv-as="$t('name')"
                        type="text"
                        :placeholder="$t('name')"
                />
              </span>
              </ErrorTooltip>
            </div>

            <div class="form_item duration_item">
              <span class="key">{{$t('duration')}}</span>
              <ErrorTooltip fieldName="duration" placementOverride="right">
              <span class="value">
                <input
                        data-vv-name="duration"
                        v-model="formItems.duration"
                        v-validate="`required|${validation.namespaceDuration}`"
                        :data-vv-as="$t('duration')"
                        type="text"
                        :placeholder="$t('duration')"
                />
                <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
              </span>
              </ErrorTooltip>
            </div>

            <div class="form_item XEM_rent_fee">
              <span class="key">{{$t('Rental_fee')}}</span>
              <span class="value">{{ estimatedRentalFee }} ({{ $t('estimate') }})</span>
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
      <div class="right-root-namespace-tips">
        <div class="tips">
          <p class="right_container_head">{{$t('root_namespace_name')}}</p>
          <p class="second_head">{{$t('namespace_name')}}</p>
          <p> {{$t('namespace_tips_key_1')}} <span class="green"> {{$t('namespace_tips_value_1')}} </span></p>
          <p> {{$t('namespace_tips_key_2')}} <span class="green"> {{$t('namespace_tips_value_2')}} </span></p>
          <p> {{$t('namespace_tips_key_3')}}</p>
          <p class="second_head">{{$t('duration')}}</p>
          <p class="green"> {{$t('namespace_duration_tip_1')}}  </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {CreateRootNamespaceTs} from '@/components/forms/create-root-namespace/CreateRootNamespaceTs.ts'

    export default class CreateRootNamespace extends CreateRootNamespaceTs {
    }
</script>
<style scoped lang="less">
  @import "./CreateRootNamespace.less";
</style>
