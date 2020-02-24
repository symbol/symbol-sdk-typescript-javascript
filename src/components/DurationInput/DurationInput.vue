<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        vid="form_label_duration"
        :name="$t(label)"
        :rules="validationRule"
        tag="div"
        class="inputs-container"
      >
        <ErrorTooltip :errors="errors">
          <input
            v-model="chosenValue"
            class="input-style input-size"
            type="number"
          >
        </ErrorTooltip>
      </ValidationProvider>
    </template>
  </FormRow>
</template>

<script lang="ts">
import {DurationInputTs} from './DurationInputTs'
export default class DurationInput extends DurationInputTs {}
</script>
