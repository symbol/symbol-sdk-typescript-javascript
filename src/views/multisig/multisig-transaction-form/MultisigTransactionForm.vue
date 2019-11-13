<template>
  <div class="multisig_form_container" @keyup.enter="submit">

    <div class="left_form radius scroll">
      <div
              v-if="!displayForm"
              class="multisig_convert_container secondary_page_animate"
      >
        <div class="multisig_convert_head">{{ $t(formHeadline) }}</div>
      </div>
      <div
              v-if="displayForm"
              class="multisig_convert_container secondary_page_animate"
      >
        <DisabledForms />

        <div class="multisig_convert_head">{{ $t(formHeadline) }}</div>
        <div class="convert_form">
          <div
                  v-if="hasMultisigAccounts && mode === MULTISIG_FORM_MODES.MODIFICATION"
                  class="multisig_add"
          >
            <div class="title">{{ $t('sender') }}</div>
            <span class="multisig_property_fee">
            <Select
                    :placeholder="$t('publicKey')"
                    v-model="formItems.multisigPublicKey"
                    class="select"
            >
              <Option
                      v-for="item in multisigPublicKeyList"
                      :value="item.publicKey" :key="item.publicKey"
              >{{ item.address }}
              </Option>
            </Select>
          </span>
          </div>

          <div class="multisig_add gray_content">
            <div class="title">{{ $t('cosigner') }}</div>
            <div class="title_describe">
              {{$t('Add_co_signers_here_will_be_displayed_in_the_action_list_click_delete_to_cancel_the_operation')}}
            </div>
            <div class="input_content">
              <input v-model="publicKeyToAdd"
                     v-focus
                     type="text" class="radius"
                     :placeholder="$t('Input_account_public_key')">
              <span
                      @click="addCosigner(CosignatoryModificationAction.Add)"
                      class="add_button radius pointer"
              >+</span>
              <span
                      v-if="mode === MULTISIG_FORM_MODES.MODIFICATION"
                      @click="addCosigner(CosignatoryModificationAction.Remove)"
                      class="delete_button radius pointer"
              >-</span>
            </div>
          </div>

          <div class="multisig_property_amount">
          <span class="gray_content">
            <div class="title">{{$t('min_approval')}}</div>
            <div class="title_describe">
              {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
            </div>
            <div class="input_content">
              <input type="text" class="radius"
                     v-model="formItems.minApproval"
                     :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')">
            </div>
          </span>

            <span class="gray_content">
            <div class="title">{{$t('min_removal')}}</div>
            <div class="title_describe">
              {{$t('The_number_of_signatures_required_to_remove_someone_from_multiple_sign_ups')}}
            </div>
            <div class="input_content">
              <input type="text" class="radius"
                     v-model="formItems.minRemoval"
                     :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')">
            </div>
          </span>
          </div>

          <div class="multisig_property_fee">
            <Select
                    data-vv-name="fee"
                    class="select"
                    v-model="formItems.feeSpeed"
                    v-validate="'required'"
                    :data-vv-as="$t('fee')"
                    :placeholder="$t('fee')"
            >
              <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
                {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
            </Select>
          </div>

          <div class="cosigner_list">
            <div class="head_title">{{$t('Operation_list')}}</div>
            <div class="list_container radius scroll">
              <div class="list_head">
                <span class="address_alias">{{$t('publicKey')}}/{{$t('alias')}}</span>
                <span class="action">{{$t('operating')}}</span>
                <span class="delete">{{$t('delete')}}</span>
              </div>
              <div class="list_body scroll">
                <div class="please_add_address" v-if="formItems.publicKeyList.length == 0">
                  {{$t('please_add_publicKey')}}
                </div>

                <div class="list_item radius" v-for="(i,index) in formItems.publicKeyList" :key="index">
                  <span class="address_alias">{{i.cosignatoryPublicAccount.publicKey}}</span>
                  <span class="action">
                {{ i.modificationAction == CosignatoryModificationAction.Add
                  ? $t('add'):$t('cut_back') }}
              </span>
                  <img class="delete pointer" @click="removeCosigner(index)"
                       src="@/common/img/service/multisig/multisigDelete.png" alt="">
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
                :class="['confirm_button',isCompleteForm?'pointer':'not_allowed'] "
                @click="submit"
        >{{$t('send')}}
        </div>

        <CheckPWDialog
                :showCheckPWDialog="showCheckPWDialog"
                @closeCheckPWDialog="closeCheckPWDialog"
                @checkEnd="checkEnd"
                :transactionDetail="transactionDetail"
                :transactionList="transactionList"
                :lockParams=lockParams
        ></CheckPWDialog>
      </div>
    </div>

    <div class="right_multisig_info radius scroll">
      <MultisigTree />
    </div>

  </div>
</template>

<script lang="ts">
    import {MultisigTransactionFormTs} from './MultisigTransactionFormTs'
    import "./MultisigTransactionForm.less"

    export default class MultisigTransactionForm extends MultisigTransactionFormTs {
    }
</script>
<style scoped lang="less">
</style>
