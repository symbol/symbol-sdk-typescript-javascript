<template>
  <div class="namespace_transaction_container secondary_page_animate">
    <DisabledForms />
    <div class="right_panel">
      <div class="left-root-namespace-form">
        <form onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="namespace_transaction">
            <div class="form_item">
              <span class="key">{{ $t('account') }}</span>
              <span
                v-if="!hasMultisigAccounts"
                class="value text_select"
              >{{ formatAddress(wallet.address) }}
              </span>
              <SignerSelector v-if="hasMultisigAccounts" v-model="formItems.multisigPublicKey" />
            </div>


            <div class="form_item">
              <span class="key">{{ $t('parent_name') }}</span>
              <span class="value">
                <ErrorTooltip field-name="parent_namespace" placement-override="right">
                  <Select
                    v-model="formItems.rootNamespaceName"
                    v-validate="'required'"
                    :placeholder="$t('select_parent_namespace')"
                    data-vv-name="parent_namespace"
                    class="select"
                    :data-vv-as="$t('parent_name')"
                  >
                    <Option
                      v-for="item in activeNamespaceList" :key="item.value"
                      :value="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </ErrorTooltip>
              </span>
            </div>

            <div class="form_item">
              <span class="key">{{ $t('Name') }}</span>
              <span class="value">
                <ErrorTooltip field-name="Subspace" placement-override="right">
                  <span class="value">
                    <input
                      v-model="formItems.subNamespaceName"
                      v-focus
                      v-validate="validation.subNamespaceName"
                      data-vv-name="Subspace"
                      :data-vv-as="$t('Name')"
                      type="text"
                      :placeholder="$t('Input_namespace_name')"
                    >
                  </span>
                </ErrorTooltip>
              </span>
            </div>

            <div class="form_item">
              <span class="key">{{ $t('fee') }}</span>
              <Select
                v-model="formItems.feeSpeed"
                v-validate="'required'"
                class="fee-select"
                data-vv-name="fee"
                :data-vv-as="$t('fee')"
                :placeholder="$t('fee')"
              >
                <Option v-for="item in defaultFees" :key="item.speed" :value="item.speed">
                  {{ $t(item.speed) }} {{ `(${item.value} ${networkCurrency.ticker})` }}
                </Option>
              </Select>
              <div class="tips">
                {{ $t('the_more_you_set_the_cost_the_higher_the_processing_priority') }}
              </div>
            </div>

            <div class="create_button pointer" @click="submit()">
              {{ $t('create') }}
            </div>
          </div>
        </form>
      </div>

      <div class="right-root-namespace-tips">
        <div class="tips">
          <p class="right_container_head">
            {{ $t('root_namespace_name') }}
          </p>
          <p class="second_head">
            {{ $t('namespace_name') }}
          </p>
          <p> {{ $t('namespace_tips_key_1') }} <span class="green"> {{ $t('namespace_tips_value_1') }} </span></p>
          <p> {{ $t('namespace_tips_key_2') }} <span class="green"> {{ $t('namespace_tips_value_2') }} </span></p>
          <p> {{ $t('namespace_tips_key_3') }}</p>
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
