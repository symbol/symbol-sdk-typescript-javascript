<template>
  <div class="mosaic_transaction_container radius secondary_page_animate">
    <DisabledForms />
    <div class="right_panel">
      <div class="left-root-namespace-form">
        <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
          <div class="form_item">
            <span class="key">{{ $t('account') }}</span>
            <span
              v-if="!hasMultisigAccounts"
              class="value text_select"
            >{{ formatAddress(wallet.address) }}</span>
            <ErrorTooltip v-if="hasMultisigAccounts" field-name="multisigPublicKey">
              <SignerSelector v-model="formItems.multisigPublicKey" />
            </ErrorTooltip>
          </div>

          <div class="form_item">
            <span class="key">{{ $t('supply') }}</span>
            <span class="value">
              <ErrorTooltip field-name="supply">
                <input
                  v-model="formItems.supply"
                  v-focus
                  v-validate="validation.supply"
                  type="text"
                  :placeholder="$t('supply')"
                  data-vv-name="supply"
                >
              </ErrorTooltip>
              <span class="number_controller">
                <img
                  class="pointer"
                  src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                  @click="addSupplyAmount "
                >
                <img
                  class="pointer"
                  src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                  @click="cutSupplyAmount"
                >
              </span>
            </span>
          </div>

          <div class="form_item">
            <span class="key">{{ $t('mosaic_divisibility') }}</span>
            <span class="value">
              <ErrorTooltip field-name="divisibility">
                <input
                  v-model="formItems.divisibility"
                  v-validate="validation.divisibility"
                  type="text"
                  :placeholder="$t('mosaic_divisibility')"
                  data-vv-name="divisibility"
                >
              </ErrorTooltip>
              <span class="number_controller">
                <img
                  class="pointer"
                  src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                  @click="addDivisibilityAmount "
                >
                <img
                  class="pointer"
                  src="@/common/img/monitor/market/marketAmountUpdateArrow.png"
                  @click="cutDivisibilityAmount"
                >
              </span>
            </span>
          </div>

          <div class="check_box">
            <Checkbox
              v-model="formItems.transferable"
              class="check_box_item"
            >
              {{ $t('transmittable') }}
            </Checkbox>
            <Checkbox
              v-model="formItems.supplyMutable"
              class="check_box_item"
            >
              {{ $t('variable_supply') }}
            </Checkbox>
            <Checkbox
              v-model="formItems.permanent"
              class="check_box_item"
            >
              {{ $t('duration_permanent') }}
            </Checkbox>
            <Checkbox v-model="formItems.restrictable" class="check_box_item">
              {{ $t('restrictable') }}
            </Checkbox>
          </div>

          <div v-if="!formItems.permanent" class="form_item duration_item">
            <span class="key">{{ $t('duration') }}</span>
            <span class="value">
              <ErrorTooltip field-name="duration">
                <input
                  v-model="formItems.duration"
                  v-validate="validation.duration"
                  type="text"
                  :placeholder="$t('duration')"
                  data-vv-name="duration"
                >
              </ErrorTooltip>
              <span class="end_label">{{ $t('duration') }}:{{ durationIntoDate }}</span>
            </span>
            <div class="tips">
              {{ $t('namespace_duration_tip_1') }}
            </div>
          </div>
          <div v-if="false" class="form_item XEM_rent_fee">
            <span class="key">{{ $t('rent') }}</span>
            <span class="value">{{ Number(formItems.duration) }}{{ networkCurrency.ticker }}</span>
          </div>

          <div class="form_item">
            <span class="key">{{ $t('fee') }}</span>
            <Select
              v-model="formItems.feeSpeed"
              v-validate="'required'"
              class="fee-select"
              data-vv-name="fee"
              :data-vv-as="$t('fee')"
              :placeholder="$t('fee')"
            >
              <Option
                v-for="item in defaultFees"
                :key="item.speed"
                :value="item.speed"
              >
                {{ $t(item.speed) }} {{ `(${item.value} ${networkCurrency.ticker})` }}
              </Option>
            </Select>
            <div class="tips">
              {{ $t('the_more_you_set_the_cost_the_higher_the_processing_priority') }}
            </div>
          </div>
          <div class="create_button pointer" @click="submit">
            {{ $t('create') }}
          </div>
        </form>
      </div>
      <div class="right-root-namespace-tips">
        <div class="tips">
          <p class="right_container_head">
            {{ $t('mosaic') }}
          </p>
          <p class="second_head">
            {{ $t('supply') }}
          </p>
          <p class="green">
            {{ $t('divisibility_can_not_less_than_0') }}
          </p>
          <p class="green">
            {{ $t('divisibility_can_not_more_than_6') }}
          </p>

          <p class="second_head">
            {{ $t('divisibility') }}
          </p>
          <p class="green">
            {{ $t('supply_can_not_less_than_0') }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {MosaicCreationTs} from '@/components/forms/mosaic-creation/MosaicCreationTs.ts'

export default class MosaicCreation extends MosaicCreationTs {
}
</script>
<style scoped lang="less">
  @import "MosaicCreation.less";
</style>
