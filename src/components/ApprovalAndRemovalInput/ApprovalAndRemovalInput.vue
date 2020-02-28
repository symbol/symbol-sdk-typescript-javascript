<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <div class="row-approval-and-removal-input inputs-container">
        <div class="select-container">
          <select
            v-model="chosenValue"
            class="select-size select-style"
            type="number"
          >
            <option
              v-for="{newDelta, value} in deltaOptions"
              :key="value"
              :value="value"
            >
              {{ newDelta }}
            </option>
          </select>
        </div>
        <div class="inline-field-description pl-2">
          {{ $t(description) }}
        </div>
      </div>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {ApprovalAndRemovalInputTs} from './ApprovalAndRemovalInputTs'

export default class ApprovalAndRemovalInput extends ApprovalAndRemovalInputTs {}
</script>
