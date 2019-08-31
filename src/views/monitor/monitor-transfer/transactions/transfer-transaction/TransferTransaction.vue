<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <form @submit.prevent="validateForm('transfer-transaction')">
      <div class="address flex_center">
        <span class="title">{{$t('transfer_target')}}</span>
        <span class="value radius flex_center">
          <ErrorTooltip fieldName="address">
            <input
                    data-vv-name="address"
                    v-model="formModel.address"
                    v-validate="standardFields.address.validation"
                    :data-vv-as="$t('transfer_target')"
                    :placeholder="$t('receive_address_or_alias')"
                    type="text"
            />
          </ErrorTooltip>
          <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>
           <div v-if="isShowSubAlias" class="selections ">
             <div class="selection_container scroll">
                <div @click="formModel.address =key " class="overflow_ellipsis"
                     v-for="(value,key) in addresAliasMap">{{value.label}}({{key}})</div>

             </div>
           </div>
        </span>
      </div>
      <div class="asset flex_center">
        <span class="title">{{$t('asset_type')}}</span>
        <span>
          <ErrorTooltip fieldName="mosaic" placementOverride="left">
            <span class="type value radius flex_center">
              <Select
                      data-vv-name="mosaic"
                      v-model="currentMosaic"
                      v-validate="'required'"
                      :data-vv-as="$t('asset_type')"
                      :placeholder="$t('asset_type')"
                      class="asset_type">
                <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
                 {{ item.label }}
                </Option>
              </Select>
            </span>
          </ErrorTooltip>

          <span class="amount value radius flex_center">
            <ErrorTooltip fieldName="amount">
              <input
                      data-vv-name="amount"
                      v-model="currentAmount"
                      v-validate="`required|${standardFields.amount.validation}`"
                      :data-vv-as="$t('amount')"
                      number
                      :placeholder="$t('please_enter_the_transfer_amount')"
                      type="text"
              />
            </ErrorTooltip>
          </span>
          <span class="add_mosaic_button radius" @click="addMosaic"></span>
        </span>
      </div>


      <div class="mosaic_list_container radius ">
        <ErrorTooltip fieldName="mosaicListLength" placementOverride="top">
          <input
                  data-vv-name="mosaicListLength"
                  number
                  type="text"
                  v-validate="standardFields.mosaicListLength.validation"
                  style="display: none"
                  v-model="formModel.mosaicTransferList.length"
          />
        </ErrorTooltip>

        <span class="mosaic_name overflow_ellipsis">{{$t('mosaic')}}</span>
        <span class="mosaic_amount overflow_ellipsis">{{$t('amount')}}</span>
        <div class="scroll">
          <div class="no_data" v-if="formModel.mosaicTransferList.length <1">
            {{$t('no_data')}}
          </div>
          <div class="mosaic_list_item radius" v-for="(m,index) in formModel.mosaicTransferList">
            <span class="mosaic_name overflow_ellipsis">{{m.id.id.toHex()}}</span>
            <span class="mosaic_amount overflow_ellipsis">{{m.amount.compact()}}</span>
            <span class="icon_delete" @click="removeMosaic(index)"></span>
          </div>
        </div>
      </div>


      <div class="remark flex_center">
        <span class="title">{{$t('remarks')}}</span>
        <ErrorTooltip fieldName="remark">
          <span class="textarea_container flex_center value radius">
            <textarea
                    v-model="formModel.remark"
                    data-vv-name="remark"
                    v-validate="standardFields.message.validation"
                    :data-vv-as="$t('remarks')"
                    class="hide_scroll"
                    :placeholder="$t('please_enter_a_comment')"
            />
          </span>
        </ErrorTooltip>
      </div>

      <div>
        <span class="title">{{$t('encryption')}}</span>

        <span>
          <span class="encryption_container">{{$t('encryption')}}</span><span
                @click="formModel.isEncrypted = false"
                :class="['encryption_item',formModel.isEncrypted?'encryption':'not_encryption']">
        </span>

          <span class="not_encryption_container">{{$t('Not_encrypted')}}</span>
          <span
                  @click="formModel.isEncrypted = true"
                  :class="['encryption_item',formModel.isEncrypted?'not_encryption':'encryption']">
        </span>

        </span>
      </div>

      <div class="fee flex_center">
        <span class="title">{{$t('fee')}}</span>
        <span class="value radius flex_center">
          <ErrorTooltip fieldName="fee">
            <input
                    data-vv-name="fee"
                    v-model="formModel.fee"
                    v-validate="standardFields.maxFee.validation"
                    :data-vv-as="$t('fee')"
                    placeholder="50000"
                    number
                    type="text"
            />
          </ErrorTooltip>
          <span class="uint">gas</span>
        </span>
      </div>
      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>
      <div
              :class="[ 'send_button', submitDisabled ?  'not_allowed' : 'pointer' ]"
              @click="submit"
      >
        {{$t('send')}}
      </div>
    </form>
    <CheckPWDialog
            :showCheckPWDialog="showCheckPWDialog"
            :transactionDetail='transactionDetail'
            :transactionList=transactionList
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    />
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
