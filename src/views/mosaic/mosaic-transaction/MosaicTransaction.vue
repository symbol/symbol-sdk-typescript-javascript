<template>
  <div class="mosaic_transaction_container radius secondary_page_animate" >
    <div class="right_panel">
      <DisabledForms></DisabledForms>
      <div class="namespace_transaction" @keyup.enter="submit">
        <div class="form_item">
          <span class="key">{{$t('account')}}</span>
          <span
                  v-if="!hasMultisigAccounts"
                  class="value text_select"
          >{{ formatAddress(wallet.address) }}
          </span>
          <Select
                  v-if="hasMultisigAccounts"
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
        </div>

        <div class="form_item">
          <span class="key">{{$t('supply')}}</span>
          <span class="value">
            <input  v-focus v-model="formItems.supply" type="text" :placeholder="$t('supply')">
            <span class="number_controller">
                <img @click="addSupplyAmount " class="pointer"
                     src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>
                <img @click="cutSupplyAmount" class="pointer"
                     src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
           </span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('mosaic_divisibility')}}</span>
          <span class="value">
            <input v-model="formItems.divisibility" type="text" :placeholder="$t('mosaic_divisibility')">
            <span class="number_controller">
              <img @click="addDivisibilityAmount " class="pointer"
                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>
              <img @click="cutDivisibilityAmount" class="pointer"
                   src="@/common/img/monitor/market/marketAmountUpdateArrow.png"/>
            </span>
           </span>
        </div>

        <div class="check_box">
          <Checkbox class="check_box_item" v-model="formItems.transferable">{{$t('transmittable')}}</Checkbox>
          <Checkbox class="check_box_item" v-model="formItems.supplyMutable">{{$t('variable_supply')}}</Checkbox>
          <Checkbox class="check_box_item" v-model="formItems.permanent">{{$t('duration_permanent')}}</Checkbox>
          <Checkbox class="check_box_item" v-model="formItems.restrictable">{{$t('restrictable')}}</Checkbox>
        </div>

        <div class="form_item duration_item" v-if="!formItems.permanent">
          <span class="key">{{$t('duration')}}</span>
          <span class="value">
             <input v-model="formItems.duration" type="text" :placeholder="$t('duration')">
            <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
         </span>
          <div class="tips">
            {{$t('namespace_duration_tip_1')}}
          </div>
        </div>

        <div class="form_item XEM_rent_fee" v-if="false">
          <span class="key">{{$t('rent')}}</span>
          <span class="value">{{Number(formItems.duration)}}{{ networkCurrency.ticker }}</span>
        </div>

        <div class="form_item">
          <span class="key">{{$t('fee')}}</span>
          <Select
                  class="fee-select"
                  data-vv-name="fee"
                  v-model="formItems.feeSpeed"
                  v-validate="'required'"
                  :data-vv-as="$t('fee')"
                  :placeholder="$t('fee')"
          >
            <Option v-for="item in defaultFees" :value="item.speed" :key="item.speed">
              {{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
            </Option>
          </Select>
          <div class="tips">
            {{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}
          </div>
        </div>

        <div class="create_button pointer" @click="submit">
            {{$t('create')}}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MosaicTransactionTs} from '@/views/mosaic/mosaic-transaction/MosaicTransactionTs.ts'

    export default class MosaicTransaction extends MosaicTransactionTs {

    }
</script>
<style scoped lang="less">
  @import "MosaicTransaction.less";
</style>
