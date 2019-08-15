<template>
  <div class="transfer" @click="isShowSubAlias=false">

    <div class="address flex_center">
      <span class="title">{{$t('Public_account')}}</span>
      <span class="value radius flex_center">
        <Select placeholder="" v-model="formItem.multisigPublickey" :placeholder="$t('Public_account')"
                class="asset_type">
         <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">{{ item.label }}</Option>
       </Select>
      </span>
    </div>


    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
        <input type="text" v-model="formItem.address" :placeholder="$t('receive_address_or_alias')">
      </span>
    </div>


    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>
      <span>
        <span class="type value radius flex_center">
          <Select v-model="formItem.mosaic" :placeholder="$t('asset_type')" class="asset_type">
            <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
        </span>
        <span class="amount value radius flex_center">
           <input v-model="formItem.amount" :placeholder="$t('please_enter_the_transfer_amount')" type="text">
         </span>
      </span>
    </div>

    <div class="remark flex_center">
      <span class="title">{{$t('remarks')}}</span>
      <span class=" textarea_container  flex_center value radius ">
              <textarea class="hide_scroll" v-model="formItem.remark"
                        :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
    </div>
    <div class="fee flex_center">
      <span class="title">{{$t('inner_fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="formItem.aggregateFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>

    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <span class="xem_tips">{{formItem.aggregateFee / 1000000}} xem </span>
    <div class="fee flex_center">
      <span class="title">{{$t('bonded_fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="formItem.bondedFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>

    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <span class="xem_tips">{{formItem.bondedFee / 1000000}} xem </span>

    <div v-if="currentMinApproval > 1">
      <div class="fee flex_center">
        <span class="title">{{$t('lock_fee')}}</span>
        <span class="value radius flex_center">
              <input v-model="formItem.lockFee" placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>
      </div>
      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
      <span class="xem_tips">{{formItem.lockFee / 1000000}} xem </span>

    </div>


    <div @click="checkInfo" v-if="isShowPanel" :class="['send_button',isCompleteForm?'pointer':'not_allowed']">
      {{$t('send')}}
    </div>
    <div class=" no_multisign pointer" v-else>
      {{$t('There_are_no_more_accounts_under_this_account')}}
    </div>

    <CheckPWDialog :transactionDetail='transactionDetail' @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"
                   :showCheckPWDialog="showCheckPWDialog"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {MultisigTransferTransactionTs} from './MultisigTransferTransactionTs'

    export default class MultisigTransferTransaction extends MultisigTransferTransactionTs {

    }

</script>
<style scoped lang="less">
  @import "MultisigTransferTransaction.less";
</style>
