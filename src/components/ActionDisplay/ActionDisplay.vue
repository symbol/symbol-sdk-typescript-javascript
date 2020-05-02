<template>
  <div>
    <span class="col2-item overflow_ellipsis"><AddressDisplay :address="transaction.signer.address" /></span>
    <span class="col2-item bottom overflow_ellipsis">
      <span v-if="transaction.type === transactionType.TRANSFER">
        ->
        <AddressDisplay :address="transaction.recipientAddress" />
      </span>
      <span v-else>{{ $t(`transaction_descriptor_${transaction.type}`) }}</span>
      <span v-if="needsCosignature" class="click-to-cosign">({{ $t('Click_to_cosign') }})</span>
    </span>
  </div>
</template>

<script lang="ts">
import { ActionDisplayTs } from './ActionDisplayTs'
export default class ActionDisplay extends ActionDisplayTs {}
</script>
