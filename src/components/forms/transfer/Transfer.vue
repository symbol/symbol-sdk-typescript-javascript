<template>
  <div class="transfer" @click="isShowSubAlias = false">
    <form @submit.prevent="validateForm('transfer-transaction')" @keyup.enter="submit">
      <div v-if="!hasMultisigAccounts" class="flex_center">
        <span class="title">{{ $t('sender') }}</span>
        <span class="value no-border">{{ formatAddress(wallet.address) }}</span>
      </div>

      <div v-if="hasMultisigAccounts" class="address flex_center">
        <span class="title">{{ $t('sender') }}</span>
        <span class="value radius flex_center">
          <SignerSelector v-model="formItems.multisigPublicKey" />
        </span>
      </div>

      <div class="target flex_center">
        <span class="title">{{ $t('transfer_target') }}</span>
        <span class="value radius flex_center">
          <ErrorTooltip field-name="recipient" placement-override="top">
            <input
              v-model="formItems.recipient"
              v-focus
              v-validate="validation.addressOrAlias"
              data-vv-name="recipient"
              :data-vv-as="$t('transfer_target')"
              :placeholder="$t('receive_address_or_alias')"
              type="text"
            >
          </ErrorTooltip>
        </span>
      </div>

      <div class="asset flex_center">
        <span>
          <span class="title">{{ $t('asset_type') }}</span>
          <span>
            <span class="type value radius flex_center">
              <Select
                v-model="selectedMosaicHex"
                v-validate
                :data-vv-as="$t('asset_type')"
                :placeholder="$t('asset_type')"
                class="asset_type"
                data-vv-name="selectedMosaicHex"
              >
                <Option
                  v-for="item in mosaicList"
                  :key="item.value"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
            </span>
            <span class="amount value radius flex_center">
              <ErrorTooltip field-name="currentAmount" placement-override="top" class="amountTooltip">
                <input
                  v-model.lazy="currentAmount"
                  v-validate="validation.amount"
                  :placeholder="$t('please_enter_the_transfer_amount')"
                  :data-vv-as="$t('amount')"
                  data-vv-name="currentAmount"
                >
              </ErrorTooltip>
            </span>
          </span>
          <span class="add_mosaic_button radius" @click="addMosaic" />
        </span>
      </div>

      <div class="mosaic_list_container radius">
        <span class="mosaic_name overflow_ellipsis">{{ $t('mosaic') }}</span>
        <span class="mosaic_amount overflow_ellipsis">{{ $t('amount') }}</span>
        <div class="scroll">
          <div v-if="formItems.mosaicTransferList.length < 1" class="no_data">
            {{ $t('please_input_mosaic_and_amount') }}
          </div>
          <div v-else class="mosaic_list_item_container scroll">
            <div
              v-for="(m,index) in formItems.mosaicTransferList"
              :key="index"
              class="mosaic_list_item radius"
            >
              <span class="mosaic_name overflow_ellipsis">
                {{
                  mosaics[m.id.id.toHex()] && mosaics[m.id.id.toHex()].name
                    ? mosaics[m.id.id.toHex()].name : m.id.id.toHex() }}
              </span>
              <span class="mosaic_amount overflow_ellipsis">
                <NumberFormatting
                  :number-of-formatting="getRelativeMosaicAmount(
                    m.amount.compact(),
                    mosaics[m.id.id.toHex()]
                      ? mosaics[m.id.id.toHex()].properties.divisibility : 1
                  )"
                />
              </span>
              <span class="icon_delete" @click="removeMosaic(index)" />
            </div>
          </div>
        </div>
      </div>

      <div class="remark flex_center">
        <span class="title">{{ $t('message') }}</span>
        <span class="textarea_container flex_center value radius">
          <ErrorTooltip field-name="message" placement-override="top" class="full-width-tooltip">
            <textarea
              v-model="formItems.remark"
              v-validate="validation.message"
              class="hide_scroll"
              data-vv-name="message"
              :data-vv-as="$t('message')"
              :placeholder="$t('please_enter_a_comment')"
            />
          </ErrorTooltip>
        </span>
      </div>
      <div class="fee flex_center">
        <span class="title">{{ $t('fee') }}</span>
        <span class="type value radius flex_center">
          <Select
            v-model="formItems.feeSpeed"
            v-validate="'required'"
            data-vv-name="mosaic"
            :data-vv-as="$t('fee')"
            :placeholder="$t('fee')"
          >
            <Option
              v-for="item in defaultFees"
              :key="item.speed"
              :value="item.speed"
            >{{ $t(item.speed) }} {{ `(${item.value} ${networkCurrency.ticker})` }}</Option>
          </Select>
        </span>
      </div>
      <!--      <span class="xem_tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</span>-->

      <div class="send_button pointer" @click="submit">
        {{ $t('send') }}
      </div>
      <input
        v-show="false"
        v-model="currentAccount"
        v-validate
        disabled
        data-vv-name="currentAccount"
      >
      <input
        v-show="false"
        v-model="selectedMosaic"
        v-validate="'required'"
        disabled
        data-vv-name="selectedMosaic"
      >
    </form>
  </div>
</template>

<script lang="ts">
import { TransferTs } from '@/components/forms/transfer/TransferTs.ts'

export default class Transfer extends TransferTs {}
</script>
<style scoped lang="less">
@import "Transfer.less";
</style>
