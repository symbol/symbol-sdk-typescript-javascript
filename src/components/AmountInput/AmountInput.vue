<template>
  <ErrorTooltip field-name="mosaicAmount">
    <input
      v-model="relativeValue"
      v-validate="validationRules.invoiceAmount"
      class="amount_input"
      type="text"
      :placeholder="$t('Please_enter_the_amount_of_transfer')"
      data-vv-name="mosaicAmount"
    >
  </ErrorTooltip>
</template>

<script lang="ts">
import {AmountInputTs} from './AmountInputTs'
import './AmountInput.less'

export default class AmountInput extends AmountInputTs {}
</script>
