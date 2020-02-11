<template>
  <div v-if="!!transaction" class="transaction-details-wrapper">

    <TransactionDetailsHeader :view="view" />
    
    <TransactionDetailsTransfer :view="view"
      v-if="isType(types.TRANSFER)" />

    <TransactionDetailsMosaicDefinition :view="view" 
      v-else-if="isType(types.MOSAIC_DEFINITION)" />

    <TransactionDetailsMosaicSupplyChange :view="view"
      v-else-if="isType(types.MOSAIC_SUPPLY_CHANGE)" />

    <TransactionDetailsNamespaceRegistration :view="view"
      v-else-if="isType(types.REGISTER_NAMESPACE)" />

    <!-- fallback -->
    <div v-else class="bottom-transaction-details">
      <div>
        Keys: {{ JSON.stringify(Array.from(view.values.keys())) }}
        Values: {{ JSON.stringify(Array.from(view.values.values())) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {TransactionDetailsTs} from './TransactionDetailsTs'
export default class TransactionDetails extends TransactionDetailsTs {}
</script>
