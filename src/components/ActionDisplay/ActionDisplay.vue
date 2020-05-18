<template>
  <div>
    <div class="overflow_ellipsis"><AddressDisplay :address="transaction.signer.address" /></div>
    <div class="bottom overflow_ellipsis">
      <span v-if="transaction.type === transactionType.TRANSFER">
        ->
        <AddressDisplay :address="transaction.recipientAddress" />
      </span>
      <span v-else>{{ $t(`transaction_descriptor_${transaction.type}`) }}</span>
      <span v-if="needsCosignature" class="click-to-cosign">({{ $t('Click_to_cosign') }})</span>
    </div>
  </div>
</template>

<script lang="ts">
import { ActionDisplayTs } from './ActionDisplayTs'
export default class ActionDisplay extends ActionDisplayTs {}
</script>
