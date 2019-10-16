<template>
  <div>
    <div class="multisig_management_container secondary_page_animate" @click="showSubPublicKeyList = false">
      <div class="container_head_title">{{$t('Edit_co_signers_and_signature_thresholds')}}</div>
      <div class="edit_form">
        <div class="form_item">
          <div class="title">{{$t('Public_account')}}</div>
          <Select v-model="formItems.multisigPublicKey" class="select" :placeholder="$t('publicKey')">
            <Option v-for="item in publicKeyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>

        <div class="form_item input_cosigner">
          <div class="title">{{$t('cosigner')}}</div>
          <div class="manage_cosigner">
          <span class="input_container">
            <input type="text" v-model="currentPublicKey" :placeholder="$t('Wallet_account_address_or_alias')"
                   class="radius">
            <span class="switch_container pointer" @click.stop="showSubPublicKeyList = !showSubPublicKeyList">
              <Tooltip :content="$t('Choose_a_co_signer')" theme="light">
                <span class="switch_cosigner"></span>
              </Tooltip>
            </span>
            <div class="sub_list radius" v-if="showSubPublicKeyList">
              <div @click="currentPublicKey = i.value" class="sub_list_item pointer" v-for="(i, index) in existsCosignerList" :key="index">{{i.value}}</div>
            </div>
          </span>
            <span @click="addCosigner(CosignatoryModificationAction.Add)"
                  class="add_button radius pointer">+</span>
            <span @click="addCosigner(CosignatoryModificationAction.Remove)"
                  class="delete_button radius pointer">-</span>
          </div>
          <div class="input_describe">
            {{$t('Add_delete_co_signers_this_action_will_be_displayed_in_the_action_log_click_delete_to_cancel')}}
          </div>
        </div>

        <div class="property_amount">
        <span class="form_item input_min_approval">
          <div class="title">{{$t('min_approval_delta')}} ( {{$t('current')}} min approval : {{currentMinApproval }} )</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItems.minApprovalDelta"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_add_someone_from_a_multi_sign_or_complete_this_multi_tap_transaction')}}
          </div>
        </span>

          <span class="form_item input_min_delete">
          <div class="title">{{$t('min_removal_delta')}} ( {{$t('current')}}  min removal : {{currentMinRemoval }} )</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItems.minRemovalDelta"
                   :placeholder="$t('Please_set_the_minimum_number_of_signatures_number_of_co_signers')"
                   class="radius">
          </div>
          <div class="input_describe">
            {{$t('The_number_of_signatures_required_to_remove_someone_from_multiple_sign_ups')}}
          </div>
        </span>
        </div>


        <div class="form_item input_fee">
          <div class="title">{{$t('inner_fee')}}</div>
          <div class="manage_cosigner">
            <input type="text" v-model="formItems.innerFee" placeholder=".5" class="radius">
<!--            <span class="xem_container">gas</span>-->
<!--            <span class="xem_amount">{{formItems.innerFee / 1000000}} xem </span>-->
          </div>
          <div class="input_describe">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>


        <div v-if="currentMinApproval > 1">
          <div class="form_item input_fee">
            <div class="title">{{$t('bonded_fee')}}</div>
            <div class="manage_cosigner">
              <input type="text" v-model="formItems.bondedFee" placeholder=".5" class="radius">
<!--              <span class="xem_container">gas</span>-->
<!--              <span class="xem_amount">{{formItems.bondedFee / 1000000}} xem </span>-->
            </div>
            <div class="input_describe">
              {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
            </div>
          </div>


          <div class="form_item input_fee">
            <div class="title">{{$t('lock_fee')}}</div>
            <div class="manage_cosigner">
              <input type="text" v-model="formItems.lockFee" placeholder=".5" class="radius">
<!--              <span class="xem_container">gas</span>-->
<!--              <span class="xem_amount">{{formItems.lockFee / 1000000}} xem </span>-->
            </div>
            <div class="input_describe">
              {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
            </div>
          </div>
        </div>
      </div>


      <div class="cosigner_list">
        <div class="head_title">{{$t('Operation_list')}}</div>
        <div class="list_container radius">
          <div class="list_head">
            <span class="address_alias">{{$t('address')}}/{{$t('alias')}}</span>
            <span class="action">{{$t('operating')}}</span>
            <span class="delate">{{$t('delete')}}</span>
          </div>
          <div class="list_body scroll">
            <div class="please_add_address" v-if="formItems.cosignerList.length == 0">{{$t('please_add_publicKey')}}
            </div>

            <div class="list_item radius" v-for="(i,index) in formItem.cosignerList" :key="index">
              <span class="address_alias">{{i.publicKey}}</span>
              <span class="action">{{i.type == CosignatoryModificationAction.Add ? $t('add'):$t('cut_back')}}</span>
              <img class="delate pointer" @click="removeCosigner(index)"
                   src="@/common/img/service/multisig/multisigDelete.png" alt="">
            </div>
          </div>
        </div>
      </div>

      <div @click="confirmInput" :class="['send_button',isCompleteForm?'pointer':'not_allowed']" v-if="isShowPanel">
        {{$t('send')}}
      </div>

      <div class=" no_multisign pointer" v-else>
        {{$t('There_are_no_more_accounts_under_this_account')}}
      </div>

      <CheckPWDialog :showCheckPWDialog="showCheckPWDialog"
                     @closeCheckPWDialog="closeCheckPWDialog"
                     @checkEnd="checkEnd"
                     :transactionList="transactionList"
                     :otherDetails="otherDetails"
      ></CheckPWDialog>
    </div>
  </div>

</template>

<script lang="ts">
    import {MultisigModificationTs} from './MultisigModificationTs'
    export default class MultisigModification extends MultisigModificationTs {}
</script>
<style scoped lang="less">
  @import "MultisigModification.less";
</style>
