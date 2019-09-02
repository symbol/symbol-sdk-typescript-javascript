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
          <Select v-model="currentMosaic" :placeholder="$t('asset_type')" class="asset_type">
            <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
        </span>
        <span class="amount value radius flex_center">
           <input v-model="currentAmount" :placeholder="$t('please_enter_the_transfer_amount')" type="text">
         </span>
      </span>

      <span class="add_mosaic_button radius" @click="addMosaic"></span>
    </div>

    <div class="mosaic_list_container radius ">
      <span class="mosaic_name overflow_ellipsis">{{$t('mosaic')}}</span>
      <span class="mosaic_amount overflow_ellipsis">{{$t('amount')}}</span>
      <div class="scroll">
        <div class="no_data" v-if="formItem.mosaicTransferList.length <1">
          {{$t('no_data')}}
        </div>
        <div class="mosaic_list_item radius" v-for="(m,index) in formItem.mosaicTransferList">
          <span class="mosaic_name overflow_ellipsis">{{m.id.id.toHex()}}</span>
          <span class="mosaic_amount overflow_ellipsis">{{m.amount.compact()}}</span>
          <span class="icon_delete" @click="removeMosaic(index)"></span>
        </div>
      </div>
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

    <div>
      <span class="title">{{$t('encryption')}}</span>

      <span>
          <span class="encryption_container">{{$t('encryption')}}</span><span
              @click="formItem.isEncryption = false"
              :class="['encryption_item',formItem.isEncryption?'encryption':'not_encryption']">
        </span>

          <span class="not_encryption_container">{{$t('Not_encrypted')}}</span>
          <span
                  @click="formItem.isEncryption = true"
                  :class="['encryption_item',formItem.isEncryption?'not_encryption':'encryption']">
        </span>

        </span>
    </div>

    <div class="fee flex_center">
      <span class="title">{{$t('inner_fee')}}</span>
      <span class="value radius flex_center">
        <input v-model="formItem.inner_fee" placeholder="50000" type="text">
        <span class="uint">gas</span>
      </span>
    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <span class="xem_tips">{{formItem.bondedFee / 1000000}} xem </span>


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
              <input v-model="formItem.lock_fee" placeholder="50000" type="text">
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

    <CheckPWDialog :transactionDetail='transactionDetail'
                   @closeCheckPWDialog="closeCheckPWDialog"
                   @checkEnd="checkEnd"
                   :showCheckPWDialog="showCheckPWDialog"
                   :otherDetails='otherDetails'
                   :transactionList="transactionList"
    ></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import {MultisigTransferTransactionTs} from '@/views/monitor/monitor-transfer/transactions/multisig-transfer-transaction/MultisigTransferTransactionTs.ts';

    export default class MultisigTransferTransaction extends MultisigTransferTransactionTs {

    }

</script>
<style scoped lang="less">
  @import "MultisigTransferTransaction.less";
</style>
