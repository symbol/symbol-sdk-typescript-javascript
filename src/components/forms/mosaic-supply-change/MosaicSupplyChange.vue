<template>
  <div class="mosaicEditDialogWrap">
    <Modal
            @keyup.enter.native="submit"
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :width="1000"
            :transfer="false"
            @on-cancel="show=false"
    >
      <DisabledForms/>

      <div slot="header" class="mosaicEditDialogHeader">
        <span class="title justify_text">{{$t('modify_supply')}}</span>
      </div>

      <div class="mosaicEditDialogBody">
        <div class="stepItem1">
          <form
                  action="submit"
                  onsubmit="event.preventDefault()"
                  @keyup.enter="submit"
                  class="form-style"
          >
            <div class="input_content">
              <div class="title justify_text">{{ $t('mosaic_ID') }}</div>
              <div class="input_area no-border">
                <p>{{ itemMosaic.hex.toString().toUpperCase() }}</p>
              </div>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{ $t('alias') }}</div>
              <div class="input_area no-border">
                <p>{{ itemMosaic.name ? itemMosaic.name : 'no data' }}</p>
              </div>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{ $t('existing_supply') }}</div>
              <div class="input_area no-border">
                <p>{{ formatNumber(supply) }}</p>
              </div>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{ $t('New_supply') }}</div>
              <div class="input_area no-border">
                <ErrorTooltip fieldName="newSupply" placementOverride="top">
                  <input
                          data-vv-name="newSupply"
                          v-model="newSupply"
                          v-validate="validation.supply"
                          :data-vv-as="$t('New_supply')"
                          v-show="false"
                  />
                  <p>{{ formatNumber(newSupply) }}</p>
                </ErrorTooltip>
              </div>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{ $t('change_type') }}</div>
              <RadioGroup v-model="formItems.supplyType" class="input_radio">
                <Radio :label="1">{{$t('increase')}}</Radio>
                <Radio :label="0">{{$t('cut_back')}}</Radio>
              </RadioGroup>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{ $t('change_amount') }}</div>
              <div class="input_area">
                <ErrorTooltip fieldName="delta" placementOverride="top">
                  <input
                          v-focus
                          data-vv-name="delta"
                          v-model="formItems.delta"
                          :data-vv-as="$t('change_amount')"
                          v-validate="validation.supply"
                          :placeholder="$t('please_enter_the_amount_of_change')"
                  />
                </ErrorTooltip>
              </div>
            </div>

            <div class="input_content">
              <div class="title justify_text">{{$t('fee')}}</div>
              <div class="input_area">
                <Select
                        class="fee-select input_select"
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
              </div>
            </div>

            <input v-show="false" v-model="wallet" v-validate disabled data-vv-name="wallet"/>

            <div class="button_content">
              <span class="bind checkBtn radius pointer" @click="submit()">{{$t('update')}}</span>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import "./MosaicSupplyChange.less";
    import {MosaicSupplyChangeTs} from "@/components/forms/mosaic-supply-change/MosaicSupplyChangeTs.ts";

    export default class MosaicSupplyChange extends MosaicSupplyChangeTs {
    }
</script>
