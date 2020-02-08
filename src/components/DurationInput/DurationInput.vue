<template>
  <div class="form-line-container">
    <FormLabel>{{ $t('duration') }}</FormLabel>
    <ValidationProvider
      v-slot="{ errors }"
      mode="lazy"
      vid="duration"
      :name="$t('duration')"
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
