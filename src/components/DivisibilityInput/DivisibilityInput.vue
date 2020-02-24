<template>
  <FormRow>
    <template v-slot:label>
      {{ $t('divisibility') }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        mode="lazy"
        vid="divisibility"
        :name="$t('divisibility')"
        :rules="validationRules.divisibility"
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
import {DivisibilityInputTs} from './DivisibilityInputTs'
export default class DivisibilityInput extends DivisibilityInputTs {}
</script>
