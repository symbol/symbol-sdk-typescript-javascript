<template>
  <div class="form-line-container">
    <div class="fee flex_center">
      <FormLabel>{{ $t('fee') }}</FormLabel>
      <div class="inline-container">
        <div class="full-width-item-container">
          <span class="type value radius flex_center">
            <Select
              v-model="chosenMaxFee"
              :placeholder="$t('fee')"
              class="select-size select-style"
            >
              <Option
                v-for="item in feeSpeeds"
                :key="item.speed"
                :value="convertToRawAmount(item.value)"
              >{{ $t(item.speed) }} {{ `(${item.value} ${networkMosaicName})` }}</Option>
            </Select>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {MaxFeeSelectorTs} from './MaxFeeSelectorTs'
import '@/styles/forms.less'
export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>
