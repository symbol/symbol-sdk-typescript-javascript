<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <form @submit.prevent="validateForm('transfer-transaction')" @keyup.enter="submit">
      <div class="flex_center" v-if="!hasMultisigAccounts">
        <span class="title">{{$t('sender')}}</span>
        <span class="value no-border"
        >{{ formatAddress(wallet.address) }}
          </span>
      </div>
      <div class="address flex_center" v-if="hasMultisigAccounts">
        <span class="title">{{$t('sender')}}</span>
        <span class="value radius flex_center">
          <Select
                  :placeholder="$t('publicKey')"
                  v-model="formItems.multisigPublicKey"
                  class="fee-select"
          >
            <Option
                    v-for="item in multisigPublicKeyList"
                    :value="item.publicKey" :key="item.publicKey"
            >{{ item.address }}
            </Option>
          </Select>
      </span>
      </div>

      <div class="target flex_center">
        <span class="title">{{$t('transfer_target')}}</span>
        <span class="value radius flex_center">
          <ErrorTooltip fieldName="recipient" placementOverride="left">
              <input
                      v-focus
                      data-vv-name="recipient"
                      v-model="formItems.recipient"
                      v-validate="standardFields.addressOrAlias.validation"
                      :data-vv-as="$t('transfer_target')"
                      :placeholder="$t('receive_address_or_alias')"
                      type="text"
              />
          </ErrorTooltip>
      </span>

        <!-- <span class="pointer" @click.stop="isShowSubAlias =!isShowSubAlias">@</span>
        <div v-if="isShowSubAlias" class="selections ">
          <div class="selection_container scroll">
            <div @click="formModel.recipient = key " class="overflow_ellipsis selection_item"
                  v-for="(value,key) in addressAliasMap">{{value.label}}({{key}})
            </div>
          </div>
          <div v-if="isAddressMapNull" class="no_data">
            {{$t('no_data')}}
          </div>
        </div> -->

      </div>

      <div class="asset flex_center">
        <span>
        <span class="title">{{$t('asset_type')}}</span>
        <span>
          <ErrorTooltip fieldName="mosaic" placementOverride="left">
            <span class="type value radius flex_center">
              <Select
                      data-vv-name="mosaic"
                      v-model="currentMosaic"
                      :data-vv-as="$t('asset_type')"
                      :placeholder="$t('asset_type')"
                      class="asset_type">
                <Option v-for="item in mosaicList" :value="item.value" :key="item.value">
                 {{ item.label }}
                </Option>
              </Select>
            </span>
          </ErrorTooltip>
          <ErrorTooltip fieldName="amount">
              <input
                      data-vv-name="amount"
                      v-model="currentMosaicAbsoluteAmount"
                      v-validate="`${standardFields.amount.validation}`"
                      :data-vv-as="$t('amount')"
                      number
                      v-show="false"
                      :placeholder="$t('please_enter_the_transfer_amount')"
                      type="text"
              />
            </ErrorTooltip>
          <span class="amount value radius flex_center">
              <input
                      v-model="currentAmount"
                      number
                      :placeholder="$t('please_enter_the_transfer_amount')"
                      type="text"
              />
          </span>

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
                  v-model="formItems.mosaicTransferList.length"
          />
        </ErrorTooltip>
        <ErrorTooltip fieldName="mosaicListLength" placementOverride="top">
          <input
                  data-vv-name="mosaicListLength"
                  number
                  type="text"
                  v-validate="`${standardFields.amount.validation}`"
                  style="display: none"
                  v-model="maxMosaicAbsoluteAmount"
          />
        </ErrorTooltip>

        <span class="mosaic_name overflow_ellipsis">{{$t('mosaic')}}</span>
        <span class="mosaic_amount overflow_ellipsis">{{$t('amount')}}</span>
        <div class="scroll">
          <div class="no_data" v-if="formItems.mosaicTransferList.length <1">
            {{$t('please_input_mosaic_and_amount')}}
          </div>
          <div class="mosaic_list_item_container scroll">

            <div
                    v-for="(m,index) in formItems.mosaicTransferList"
                    :key="index"
                    class="mosaic_list_item radius"
            >
                <span class="mosaic_name overflow_ellipsis">{{
                  mosaics[m.id.id.toHex()] && mosaics[m.id.id.toHex()].name
                    ? mosaics[m.id.id.toHex()].name : m.id.id.toHex()}}
              </span>
              <span class="mosaic_amount overflow_ellipsis">{{getRelativeMosaicAmount(
                m.amount.compact(), mosaics[m.id.id.toHex()]
                ? mosaics[m.id.id.toHex()].properties.divisibility : 1)
              }}</span>
              <!-- @TODO: remove quick fix after handling cat.harvest -->
              <span class="icon_delete" @click="removeMosaic(index)"></span>
            </div>

          </div>
        </div>
      </div>

      <div class="remark flex_center">
        <span class="title">{{$t('remarks')}}</span>
        <span class=" textarea_container  flex_center value radius ">
           <ErrorTooltip fieldName="message" placementOverride="top">
          <input
                  data-vv-name="message"
                  number
                  type="text"
                  v-validate="standardFields.message.validation"
                  style="display: none"
                  v-model="formItems.remark"
          />
        </ErrorTooltip>
              <textarea class="hide_scroll"
                        v-model="formItems.remark"
                        :placeholder="$t('please_enter_a_comment')"></textarea>
            </span>
      </div>

      <!-- <div>
        <span class="title">{{$t('remark_type')}}</span>
        <span>
          <span class="encryption_container">{{$t('encryption')}}</span>
          <span
                  @click="formItems.isEncrypted = false"
                  :class="['encryption_item',formItems.isEncrypted?'encryption':'not_encryption']"
          />
          <span class="not_encryption_container">{{$t('Not_encrypted')}}</span>
          <span
                  @click="formItems.isEncrypted = true"
                  :class="['encryption_item',formItems.isEncrypted?'not_encryption':'encryption']"
          />
        </span>
      </div> -->

      <div class="fee flex_center">
        <span class="title">{{$t('fee')}}</span>
        <span class="type value radius flex_center">
            <Select
                    data-vv-name="mosaic"
                    v-model="formItems.feeSpeed"
                    v-validate="'required'"
                    :data-vv-as="$t('fee')"
                    :placeholder="$t('fee')"
            >
              <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
                {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
            </Select>
          </span>
      </div>
      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>

      <div @click="submit" :class="['send_button',isCompleteForm?'pointer':'not_allowed']">
        {{$t('send')}}
      </div>
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
