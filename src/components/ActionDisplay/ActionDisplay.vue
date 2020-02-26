<template>
  <span class="col2-item bottom overflow_ellipsis">
    <span v-if="transaction.type === transactionType.TRANSFER">-></span>
    <span>{{ descriptor }}</span>

    <span v-if="needsCosignature" class="click-to-cosign">({{ $t('Click_to_cosign') }})</span>
  </span>
</template>

<script lang="ts">
import { ActionDisplayTs } from './ActionDisplayTs'
export default class ActionDisplay extends ActionDisplayTs {}
</script>
