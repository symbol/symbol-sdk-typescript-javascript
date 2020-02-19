<template>
  <div class="form-line-container">
    <FormLabel>{{ $t(label) }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="form_label_duration"
      :name="$t(label)"
      :rules="validationRule"
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
import {DurationInputTs} from './DurationInputTs'
export default class DurationInput extends DurationInputTs {}
</script>
