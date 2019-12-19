<template>
  <div class="transfer" @click="isShowSubAlias=false">
    <form @submit.prevent="validateForm('transfer-transaction')" @keyup.enter="submit">
      <div class="flex_center" v-if="!hasMultisigAccounts">
        <span class="title">{{$t('sender')}}</span>
        <span class="value no-border">{{ formatAddress(wallet.address) }}</span>
      </div>

      <div class="address flex_center" v-if="hasMultisigAccounts">
        <span class="title">{{$t('sender')}}</span>
        <span class="value radius flex_center">
          <SignerSelector v-model="formItems.multisigPublicKey" />
        </span>
      </div>

      <div class="target flex_center">
        <span class="title">{{$t('transfer_target')}}</span>
        <span class="value radius flex_center">
          <ErrorTooltip fieldName="recipient" placementOverride="top">
            <input
              v-focus
              data-vv-name="recipient"
              v-model="formItems.recipient"
              v-validate="validation.addressOrAlias"
              :data-vv-as="$t('transfer_target')"
              :placeholder="$t('receive_address_or_alias')"
              type="text"
            />
          </ErrorTooltip>
        </span>
      </div>

      <div class="asset flex_center">
        <span>
          <span class="title">{{$t('asset_type')}}</span>
          <span>
            <span class="type value radius flex_center">
              <Select
                v-model="selectedMosaicHex"
                :data-vv-as="$t('asset_type')"
                :placeholder="$t('asset_type')"
                class="asset_type"
                v-validate
                data-vv-name="selectedMosaicHex"
              >
                <Option
                  v-for="item in mosaicList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
            <span class="amount value radius flex_center">
              <ErrorTooltip fieldName="currentAmount" placementOverride="top" class="amountTooltip">
                <input
                  v-model.lazy="currentAmount"
                  :placeholder="$t('please_enter_the_transfer_amount')"
                  v-validate="validation.amount"
                  :data-vv-as="$t('amount')"
                  data-vv-name="currentAmount"
                />
              </ErrorTooltip>
            </span>
          </span>
          <span class="add_mosaic_button radius" @click="addMosaic"></span>
        </span>
      </div>

      <div class="mosaic_list_container radius">
        <span class="mosaic_name overflow_ellipsis">{{$t('mosaic')}}</span>
        <span class="mosaic_amount overflow_ellipsis">{{$t('amount')}}</span>
        <div class="scroll">
          <div class="no_data" v-if="formItems.mosaicTransferList.length <1" >{{$t('please_input_mosaic_and_amount')}}</div>
          <div v-else class="mosaic_list_item_container scroll">
            <div
              v-for="(m,index) in formItems.mosaicTransferList"
              :key="index"
              class="mosaic_list_item radius"
            >
              <span class="mosaic_name overflow_ellipsis">
                {{
                mosaics[m.id.id.toHex()] && mosaics[m.id.id.toHex()].name
                ? mosaics[m.id.id.toHex()].name : m.id.id.toHex()}}
              </span>
              <span class="mosaic_amount overflow_ellipsis">
                {{getRelativeMosaicAmount(
                m.amount.compact(), mosaics[m.id.id.toHex()]
                ? mosaics[m.id.id.toHex()].properties.divisibility : 1)
                }}
              </span>
              <span class="icon_delete" @click="removeMosaic(index)"></span>
            </div>
          </div>
        </div>
      </div>

      <div class="remark flex_center">
        <span class="title">{{$t('message')}}</span>
        <span class="textarea_container flex_center value radius">
          <ErrorTooltip fieldName="message" placementOverride="top" class="full-width-tooltip">
            <textarea
              class="hide_scroll"
              v-model="formItems.remark"
              v-validate="validation.message"
              data-vv-name="message"
              :data-vv-as="$t('message')"
              :placeholder="$t('please_enter_a_comment')"
            />
          </ErrorTooltip>
        </span>
      </div>
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
            <Option
              v-for="item in defaultFees"
              :value="item.speed"
              :key="item.speed"
            >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}</Option>
          </Select>
        </span>
      </div>
<!--      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>-->

      <div @click="submit" class="send_button pointer">{{$t('send')}}</div>
      <input v-show="false"
        v-model="currentAccount"
        v-validate
        disabled
        data-vv-name="currentAccount"
      />
      <input
        v-show="false"
        v-model="selectedMosaic"
        v-validate="'required'"
        disabled
        data-vv-name="selectedMosaic"
      />
    </form>
  </div>
</template>

<script lang="ts">
import { TransferTs } from "@/components/forms/transfer/TransferTs.ts";

export default class Transfer extends TransferTs {}
</script>
<style scoped lang="less">
@import "Transfer.less";
</style>
