<template>
  <div class="form-line-container">
    <FormLabel>{{ $t(label) }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="supply"
      :name="$t(label)"
      :rules="validationRules.supply"
      class="inline-container"
    >
      <ErrorTooltip :errors="errors">
        <div class="full-width-item-container">
          <input
            v-model="chosenValue"
            class="input-style input-size"
            type="number"
          >
        </div>
      </ErrorTooltip>
    </ValidationProvider>
  </div>
</template>

<script lang="ts">
import {SupplyInputTs} from './SupplyInputTs'
export default class SupplyInput extends SupplyInputTs {}
</script>
