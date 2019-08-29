<template>
  <div class="transfer">
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
        </span>
      </div>
      <div class="asset flex_center">
        <span class="title">{{$t('asset_type')}}</span>
        <span>
          <ErrorTooltip fieldName="mosaic" placementOverride="left">
            <span class="type value radius flex_center">
              <Select
                      data-vv-name="mosaic"
                      v-model="formModel.mosaic"
                      v-validate="'required'"
                      :data-vv-as="$t('asset_type')"
                      :placeholder="$t('asset_type')"
                      class="asset_type"
              >
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
                      v-model="formModel.amount"
                      v-validate="`required|${standardFields.amount.validation}`"
                      :data-vv-as="$t('amount')"
                      number
                      :placeholder="$t('please_enter_the_transfer_amount')"
                      type="text"
              />
            </ErrorTooltip>
          </span>
        </span>
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
