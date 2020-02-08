<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('divisibility') }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="divisibility"
      :name="$t('divisibility')"
      :rules="validationRules.divisibility"
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
import {DivisibilityInputTs} from './DivisibilityInputTs'
export default class DivisibilityInput extends DivisibilityInputTs {}
</script>
