<template>
  <ValidationProvider
    v-slot="{ errors }"
    mode="lazy"
    vid="amount"
    :name="$t('amount')"
    :rules="validationRules.amount"
    tag="div"
    class="inputs-container"
  >
    <ErrorTooltip :errors="errors">
      <input
        v-model="relativeValue"
        class="input-style input-size"
        type="text"
      >
    </ErrorTooltip>
  </ValidationProvider>
</template>

<script lang="ts">
import {AmountInputTs} from './AmountInputTs'

export default class AmountInput extends AmountInputTs {}
</script>
