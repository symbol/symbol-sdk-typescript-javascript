<template>
  <div class="select-container">
    <Select
      v-model="chosenMaxFee"
      :placeholder="$t('fee')"
      class="select-size select-style"
    >
      <Option :value="feeValues.slowest">
        {{ $t('fee_speed_slowest') }}: {{ getRelative(feeValues.slowest) }} {{ networkMosaicName }}
      </Option>
      <Option :value="feeValues.slow">
        {{ $t('fee_speed_slow') }}: {{ getRelative(feeValues.slow) }} {{ networkMosaicName }}
      </Option>
      <Option :value="feeValues.normal">
        {{ $t('fee_speed_normal') }}: {{ getRelative(feeValues.normal) }} {{ networkMosaicName }}
      </Option>
      <Option :value="feeValues.fast">
        {{ $t('fee_speed_fast') }}: {{ getRelative(feeValues.fast) }} {{ networkMosaicName }}
      </Option>
      <Option :value="feeValues.fastest">
        {{ $t('fee_speed_fastest') }}: {{ getRelative(feeValues.fastest) }} {{ networkMosaicName }}
      </Option>
    </Select>
  </div>
</template>

<script lang="ts">
import {MaxFeeSelectorTs} from './MaxFeeSelectorTs'
export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>
