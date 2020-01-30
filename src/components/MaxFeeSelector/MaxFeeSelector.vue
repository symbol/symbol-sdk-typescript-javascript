<template>
  <div class="fee flex_center">
    <span class="title">{{ $t('fee') }}</span>
    <span class="type value radius flex_center">
      <Select
        v-model="chosenMaxFee"
        v-validate="'required'"
        data-vv-name="mosaic"
        :data-vv-as="$t('fee')"
        :placeholder="$t('fee')"
      >
        <Option
          v-for="item in feeSpeeds"
          :key="item.speed"
          :value="convertToRawAmount(item.value)"
        >{{ $t(item.speed) }} {{ `(${item.value} ${networkMosaicName})` }}</Option>
      </Select>
    </span>
  </div>
</template>

<script lang="ts">
import {MaxFeeSelectorTs} from '@/components/MaxFeeSelector/MaxFeeSelectorTs.ts'
import "./MaxFeeSelector.less";

export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>
