<template>
  <div>
    <div class="multisig_convert_container">
      <div class="multisig_convert_head">{{$t('Convert_to_multi_sign_account')}}</div>
      <div class="convert_form">
        <div class="multisig_add gray_content">
          <div class="title">{{$t('cosigner')}}</div>
          <div class="title_describe">
            {{$t('Add_co_signers_here_will_be_displayed_in_the_action_list_click_delete_to_cancel_the_operation')}}
          </div>
          <div class="input_content">
            <input v-model="currentAddress" type="text" class="radius"
                   :placeholder="$t('Wallet_account_address_or_alias')">
            <span @click="addAddress" class="add_button radius pointer">+</span>
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
                   v-model="formItem.minApproval"
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
                   v-model="formItem.minRemoval"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')">
          </div>
        </span>
        </div>

        <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('inner_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.innerFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.innerFee / 1000000}} xem </span>
          </div>
        </span>
        </div>

        <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('bonded_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.bondedFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.bondedFee / 1000000}} xem </span>
          </div>
        </span>
        </div>


        <div class="multisig_property_fee">
        <span class="gray_content">
          <div class="title">{{$t('lock_fee')}}</div>
          <div class="title_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
          <div class="input_content">
            <input type="text" v-model="formItem.lockFee" class="radius" placeholder="0.050000">
            <span class="XEM_tag">gas </span>
            <span class="xem_amount">{{formItem.lockFee / 1000000}} xem </span>
          </div>
        </span>
        </div>

        <div class="cosigner_list">
          <div class="head_title">{{$t('Operation_list')}}</div>
          <div class="list_container radius">
            <div class="list_head">
              <span class="address_alias">{{$t('publickey')}}/{{$t('alias')}}</span>
              <span class="action">{{$t('operating')}}</span>
              <span class="delate">{{$t('delete')}}</span>
            </div>
            <div class="list_body scroll">
              <div class="please_add_address" v-if="formItem.publickeyList.length == 0">{{$t('please_add_publickey')}}
              </div>

              <div class="list_item radius" v-for="(i,index) in formItem.publickeyList">
                <span class="address_alias">{{i}}</span>
                <span class="action">{{$t('add')}}</span>
                <img class="delate pointer" @click="deleteAdress(index)"
                     src="@/common/img/service/multisig/multisigDelete.png" alt="">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div @click="confirmInput" :class="['confirm_button',isCompleteForm?'pointer':'not_allowed'] " v-if="!isMultisig">
        {{$t('send')}}
      </div>
      <div class=" is_multisign pointer" v-else>
        {{$t('This_account_is_already_a_multi_sign_account')}}
      </div>

      <CheckPWDialog :showCheckPWDialog="showCheckPWDialog" @closeCheckPWDialog="closeCheckPWDialog"
                     @checkEnd="checkEnd"></CheckPWDialog>
    </div>

  </div>

</template>

<script lang="ts">
    import {MultisigConversionTs} from './MultisigConversionTs'

    export default class MultisigConversion extends MultisigConversionTs {

    }
</script>
<style scoped lang="less">
  @import "MultisigConversion.less";
</style>
