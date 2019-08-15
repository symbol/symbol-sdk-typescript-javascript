<template>
  <div class="transfer" @click="isShowSubAlias=false">

    <div class="address flex_center">
      <span class="title">{{$t('transfer_target')}}</span>
      <span class="value radius flex_center">
              <input type="text" v-model="formItem.address" :placeholder="$t('receive_address_or_alias')">
        <!--              <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>-->
        <!--               <div v-if="isShowSubAlias" class="selections">-->
        <!--            </div>-->
            </span>
    </div>
    <div class="asset flex_center">
      <span class="title">{{$t('asset_type')}}</span>


      <span>
        <span class="type value radius flex_center">
          <Select :placeholder="$t('asset_type')" v-model="formItem.mosaic" class="asset_type">
            <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
              {{ item.label }}
            </Option>
           </Select>
        </span>
        <span class="amount value radius flex_center">
           <input v-model="formItem.amount" number :placeholder="$t('please_enter_the_transfer_amount')" type="text">
         </span>
      </span>


    </div>
    <div class="remark flex_center">
      <span class="title">{{$t('remarks')}}</span>
      <span class=" textarea_container  flex_center value radius ">
              <textarea class="hide_scroll" v-model="formItem.remark" :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
    </div>
    <div class="fee flex_center">
      <span class="title">{{$t('fee')}}</span>
      <span class="value radius flex_center">
              <input v-model="formItem.fee" number placeholder="50000" type="text">
              <span class="uint">gas</span>
            </span>
    </div>
    <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
    <div @click="checkInfo" :class="['send_button',isCompleteForm?'pointer':'not_allowed']">
      {{$t('send')}}
    </div>


    <CheckPWDialog :transactionDetail='transactionDetail' @closeCheckPWDialog="closeCheckPWDialog" @checkEnd="checkEnd"
                   :showCheckPWDialog="showCheckPWDialog"></CheckPWDialog>
  </div>
</template>

<script lang="ts">
    import TransferTransactionTs from './TransferTransactionTs'

    export default class TransferTransaction extends TransferTransactionTs {

    }
</script>
<style scoped lang="less">
  @import "TransferTransaction.less";
</style>
