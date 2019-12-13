<template>
  <div class="mosaic_transaction_container radius secondary_page_animate">
    <DisabledForms/>
    <div class="right_panel">
      <div class="left-root-namespace-form">
        <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="form_item">
            <span class="key">{{$t('account')}}</span>
            <span
                    v-if="!hasMultisigAccounts"
                    class="value text_select"
            >{{ formatAddress(wallet.address) }}</span>
            <ErrorTooltip fieldName="multisigPublicKey" v-if="hasMultisigAccounts">
              <SignerSelector v-model="formItems.multisigPublicKey"/>
            </ErrorTooltip>
          </div>

          <div class="form_item">
            <span class="key">{{$t('supply')}}</span>
            <span class="value">
              <ErrorTooltip fieldName="supply">
                <input
                        v-focus
                        v-model="formItems.supply"
                        type="text"
                        :placeholder="$t('supply')"
                        data-vv-name="supply"
                        v-validate="validation.supply"
                />
              </ErrorTooltip>
              <span class="number_controller">
                <img
                        @click="addSupplyAmount "
                        class="pointer"
                        src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                />
                <img
                        @click="cutSupplyAmount"
                        class="pointer"
                        src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                />
              </span>
            </span>
          </div>

          <div class="form_item">
            <span class="key">{{$t('mosaic_divisibility')}}</span>
            <span class="value">
              <ErrorTooltip fieldName="divisibility">
                <input
                        v-model="formItems.divisibility"
                        type="text"
                        :placeholder="$t('mosaic_divisibility')"
                        v-validate="validation.divisibility"
                        data-vv-name="divisibility"
                />
              </ErrorTooltip>
              <span class="number_controller">
                <img
                        @click="addDivisibilityAmount "
                        class="pointer"
                        src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                />
                <img
                        @click="cutDivisibilityAmount"
                        class="pointer"
                        src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                />
              </span>
            </span>
          </div>

          <div class="check_box">
            <Checkbox
                    class="check_box_item"
                    v-model="formItems.transferable"
            >{{$t('transmittable')}}
            </Checkbox>
            <Checkbox
                    class="check_box_item"
                    v-model="formItems.supplyMutable"
            >{{$t('variable_supply')}}
            </Checkbox>
            <Checkbox
                    class="check_box_item"
                    v-model="formItems.permanent"
            >{{$t('duration_permanent')}}
            </Checkbox>
            <Checkbox class="check_box_item" v-model="formItems.restrictable">{{$t('restrictable')}}</Checkbox>
          </div>

          <div class="form_item duration_item" v-if="!formItems.permanent">
            <span class="key">{{$t('duration')}}</span>
            <span class="value">
              <ErrorTooltip fieldName="duration">
                <input
                        v-model="formItems.duration"
                        type="text"
                        v-validate="validation.duration"
                        :placeholder="$t('duration')"
                        data-vv-name="duration"
                />
              </ErrorTooltip>
              <span class="end_label">{{$t('duration')}}:{{durationIntoDate}}</span>
            </span>
            <div class="tips">{{$t('namespace_duration_tip_1')}}</div>
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
              <Option
                      v-for="item in defaultFees"
                      :value="item.speed"
                      :key="item.speed"
              >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
            </Select>
            <div class="tips">{{$t('the_more_you_set_the_cost_the_higher_the_processing_priority')}}</div>
          </div>
          <div class="create_button pointer" @click="submit">{{$t('create')}}</div>
        </form>
      </div>
      <div class="right-root-namespace-tips">
        <div class="tips">
          <p class="right_container_head">{{$t('mosaic')}}</p>
          <p class="second_head">{{$t('supply')}}</p>
          <p  class="green">{{$t('divisibility_can_not_less_than_0')}}</p>
          <p  class="green">{{$t('divisibility_can_not_more_than_6')}}</p>

          <p class="second_head">{{$t('divisibility')}}</p>
          <p  class="green"> {{$t('supply_can_not_less_than_0')}}</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MosaicCreationTs} from "@/components/forms/mosaic-creation/MosaicCreationTs.ts";

    export default class MosaicCreation extends MosaicCreationTs {
    }
</script>
<style scoped lang="less">
  @import "MosaicCreation.less";
</style>
