<template>
  <div class="multisig_form_container">
    <div class="left_form radius">
      <DisabledForms />
      <div class="form-wrapper radius">
        <div class="multisig_convert_container secondary_page_animate">
          <div class="multisig_convert_head">
            {{ $t('Cosign_aggregate_transactions') }}
          </div>
        </div>
        <div
          class="multisig_convert_container secondary_page_animate padding-override padding-bottom"
        >
          <div class="multisig_add gray_content">
            <div class="title">
              {{ $t('Refresh_partial_transaction_of_address') }}
            </div>
            <div class="input_content">
              <form onsubmit="event.preventDefault()" style="display: flex">
                <ErrorTooltip field-name="currentAddress">
                  <AutoComplete
                    v-model="currentAddress"
                    v-validate="'required|address'"
                    v-focus
                    data-vv-name="currentAddress"
                    type="text"
                    class="select"
                    :placeholder="$t('Address')"
                    :data-vv-as="$t('Address')"
                  >
                    <Option v-for="m in multisigAccounts" :key="m" :value="m">
                      <span>{{ m }}</span>
                    </Option>
                  </AutoComplete>
                </ErrorTooltip>
                <span class="refresh-button radius pointer" @click="submit">{{ $t('refresh') }}</span>
                <span
                  class="refresh-button radius pointer"
                  @click="refreshAll"
                >{{ $t('Refresh_all') }}</span>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction-wrapper radius">
        <TransactionList :mode="TransactionCategories.TO_COSIGN" />
      </div>
    </div>
    <div class="right_multisig_info radius scroll">
      <MultisigTree />
    </div>
  </div>
</template>

<script lang="ts">
import { MultisigCosignTs } from './MultisigCosignTs'
export default class MultisigCosign extends MultisigCosignTs {}
</script>
<style scoped lang="less">
@import "MultisigCosign.less";
</style>
