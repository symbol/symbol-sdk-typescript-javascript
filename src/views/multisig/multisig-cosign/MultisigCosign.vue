<template>
  <div class="multisig_form_container">
    <div class="left_form radius">
      <div class="form-wrapper radius">
        <div class="multisig_convert_container secondary_page_animate">
          <div class="multisig_convert_head">{{ 'Cosign aggregate transactions' }}</div>
        </div>
        <div class="multisig_convert_container secondary_page_animate padding-override padding-bottom">
          <div class="multisig_add gray_content">
            <div class="title">{{ $t('Refresh_partial_transaction_of_address') }}</div>
            <div class="input_content">
              <form
                @keyup.enter.native="submit"
                style="display: flex"
              >
                <ErrorTooltip
                @submit.prevent="validateForm('transfer-zzz')"
                 fieldName="currentAddress">
                  <AutoComplete
                    data-vv-name="currentAddress"
                    v-model="currentAddress"
                    v-validate="'required|address'"
                    v-focus
                    type="text"
                    class="select"
                    :placeholder="$t('Address')"
                    :data-vv-as="$t('Address')"
                  >
                    <Option v-for="m in multisigAccounts" :value="m" :key="m">
                      <span>{{ m }}</span>
                    </Option>
                  </AutoComplete>
                </ErrorTooltip>
                <span
                  @click="submit"
                  class="refresh-button radius pointer"
                >{{'Refresh'}}</span>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div class="transaction-wrapper radius">
        <TransactionList :mode="TRANSACTIONS_CATEGORIES.TO_COSIGN" />
      </div>
    </div>
    <div class="right_multisig_info radius scroll"><MultisigTree /></div>
  </div>
</template>

<script lang="ts">
    import {MultisigCosignTs} from './MultisigCosignTs'
    export default class MultisigCosign extends MultisigCosignTs {}
</script>
<style scoped lang="less">
    @import "MultisigCosign.less";
</style>
