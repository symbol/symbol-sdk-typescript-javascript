<template>
  <ValidationProvider
    v-slot="{ errors }"
    mode="lazy"
    vid="amount"
    :name="$t('amount')"
    :rules="'required'"
    class="half-width-item-container"
    tag="div"
  >
    <ErrorTooltip :errors="errors">
      <Select
        v-model="chosenValue"
        class="select-size select-style"
        type="text"
      >
        <Option
          v-for="{newDelta, value} in deltaOptions"
          :key="value"
          :value="value"
        >
          {{ newDelta }}
        </Option>
      </Select>
    </ErrorTooltip>
  </ValidationProvider>
</template>

<script lang="ts">
import {ApprovalAndRemovalInputTs} from './ApprovalAndRemovalInputTs'

export default class ApprovalAndRemovalInput extends ApprovalAndRemovalInputTs {}
</script>
