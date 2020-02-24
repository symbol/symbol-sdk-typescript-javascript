<template>
  <FormRow>
    <template v-slot:label>
      {{ $t(label) }}:
    </template>
    <template v-slot:inputs>
      <ValidationProvider
        v-slot="{ errors }"
        vid="supply"
        :name="$t(label)"
        :rules="validationRules.supply"
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
import {SupplyInputTs} from './SupplyInputTs'
export default class SupplyInput extends SupplyInputTs {}
</script>
