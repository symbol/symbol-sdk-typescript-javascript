<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <form @submit.prevent="validateForm('transfer-transaction')">
      <div class="address flex_center">
        <span class="title">{{$t('sender')}}</span>
        <span class="value radius flex_center">
        <Select
                v-model="formItem.multisigPublickey"
                :placeholder="$t('Please_select_public_key')"
                class="asset_type"
        >
          <Option v-for="item in multisigPublickeyList" :value="item.value" :key="item.value">
            {{ item.label.substring(0,20) }}******{{item.label.substr(-20,20) }}
          </Option>
       </Select>
      </span>
      </div>

      <div class="target flex_center">
        <span class="title">{{$t('transfer_target')}}</span>
        <span class="value radius flex_center">
        <input type="text" v-model="formItem.address" :placeholder="$t('receive_address_or_alias')">
      </span>
        <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>
        <div v-if="isShowSubAlias" class="selections ">
          <div class="selection_container scroll">
            <div @click="formModel.address =key " class="overflow_ellipsis selection_item"
                 v-for="(value,key) in addressAliasMap">{{value.label}}({{key}})
            </div>
          </div>
          <div v-if="isAddressMapNull" class="no_data">
            {{$t('no_data')}}
          </div>
        </div>
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

      <div class="mosaic_list_container radius  ">
        <ErrorTooltip fieldName="mosaicListLength" placementOverride="top">
          <input
                  data-vv-name="mosaicListLength"
                  number
                  type="text"
                  v-validate="standardFields.mosaicListLength.validation"
                  style="display: none"
                  v-model="formItem.mosaicTransferList.length"
          />
        </ErrorTooltip>

        <span class="mosaic_name overflow_ellipsis">{{$t('mosaic')}}</span>
        <span class="mosaic_amount overflow_ellipsis">{{$t('amount')}}</span>
        <div class="scroll">
          <div class="no_data" v-if="formItem.mosaicTransferList.length <1">
            {{$t('no_data')}}
          </div>
          <div class="mosaic_list_item_container scroll">

            <div class="mosaic_list_item radius" v-for="(m,index) in formItem.mosaicTransferList">
              <span class="mosaic_name overflow_ellipsis">{{mosaics[m.id.id.toHex()].name||m.id.id.toHex()}}</span>
              <span class="mosaic_amount overflow_ellipsis">{{getRelativeMosaicAmount(m.amount.compact(),mosaics[currentMosaic].properties.divisibility)}}</span>
              <span class="icon_delete" @click="removeMosaic(index)"></span>
            </div>

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

      <div>
        <span class="title">{{$t('remark_type')}}</span>
        <span>
          <span class="encryption_container">{{$t('encryption')}}</span>
          <span
                  @click="formItem.isEncrypted = false"
                  :class="['encryption_item',formItem.isEncrypted?'encryption':'not_encryption']"
          />
          <span class="not_encryption_container">{{$t('Not_encrypted')}}</span>
          <span
                  @click="formItem.isEncrypted = true"
                  :class="['encryption_item',formItem.isEncrypted?'not_encryption':'encryption']"
          />
        </span>
      </div>

      <div class="fee flex_center">
        <span class="title">{{$t('inner_fee')}}</span>
        <span class="value radius flex_center">
        <input v-model="formItem.aggregateFee" placeholder=".5" type="text">
      </span>
      </div>
      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>


      <div v-if="isMultisig">
        <div class="fee flex_center">
          <span class="title">{{$t('bonded_fee')}}</span>
          <span class="value radius flex_center">
        <input v-model="formItem.aggregateFee" placeholder=".5" type="text">
      </span>
        </div>
        <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>


        <div class="fee flex_center" v-if="currentMinApproval > 1">
          <span class="title">{{$t('lock_fee')}}</span>
          <span class="value radius flex_center">
              <input v-model="formItem.lockFee" placeholder=".5" type="text">
            </span>
        </div>
        <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>

      </div>


      <div @click="submit" :class="['send_button',isCompleteForm?'pointer':'not_allowed']">
        {{$t('send')}}
      </div>

      <CheckPWDialog
              :transactionDetail='transactionDetail'
              @closeCheckPWDialog="closeCheckPWDialog"
              @checkEnd="checkEnd"
              :showCheckPWDialog="showCheckPWDialog"
              :otherDetails='otherDetails'
              :transactionList="transactionList"
      ></CheckPWDialog>
    </form>
  </div>
</template>

<script lang="ts">
    import {TransactionFormTs} from '@/views/monitor/monitor-transfer/transactions/TransactionFormTs.ts'

    export default class MultisigTransferTransaction extends TransactionFormTs {

    }

</script>
<style scoped lang="less">
  @import "TransactionForm.less";
</style>
