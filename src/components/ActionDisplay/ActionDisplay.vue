<template>
  <span
    class="col2-item bottom overflow_ellipsis"
  >
    <span v-if="transaction.type === TransactionType.TRANSFER">-></span> 
    <span v-else>&nbsp;&nbsp;&nbsp;</span>

    <span>{{ details }}</span>

    <span v-if="needsCosignature" class="click-to-cosign">
      ({{ $t('Click_to_cosign') }})
    </span>
  </span>
</template>

<script lang="ts">
import {TransactionType} from 'nem2-sdk'
import {ActionDisplayTs} from './ActionDisplayTs'

export default class ActionDisplay extends ActionDisplayTs {}
</script>
