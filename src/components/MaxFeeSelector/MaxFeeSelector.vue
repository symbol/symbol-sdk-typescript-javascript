<template>
  <div class="select-container">
    <Select v-model="chosenMaxFee" :placeholder="$t('fee')" class="select-size select-style">
      <Option v-for="{ maxFee, label } in fees" :key="maxFee" :value="maxFee">
        {{ label }}
      </Option>
    </Select>
  </div>
</template>

<script lang="ts">
import { MaxFeeSelectorTs } from './MaxFeeSelectorTs'
export default class MaxFeeSelector extends MaxFeeSelectorTs {}
</script>
