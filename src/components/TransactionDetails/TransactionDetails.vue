<template>
  <div v-if="views" class="transaction-details-main-container">
    <div class="transaction-details-header-container">
      <TransactionDetailsHeader :view="views[0]" />
    </div>
    <div class="transaction-details-detail-section-title-container">
      <span class="transaction-details-detail-section-title">
        {{ $t('transaction_details') }}
      </span>
    </div>
    <div class="transaction-details-outer-container">
      <div
        v-for="(view, key) in views"
        :key="key"
      >
        <AccountAddressRestriction v-if="isType(types.ACCOUNT_ADDRESS_RESTRICTION, view)" :view="view" />
        <AccountLink v-if="isType(types.ACCOUNT_LINK, view)" :view="view" />
        <AccountMetadata v-if="isType(types.ACCOUNT_METADATA, view)" :view="view" />
        <AccountMosaicRestriction v-if="isType(types.ACCOUNT_MOSAIC_RESTRICTION, view)" :view="view" />
        <AccountOperationRestriction v-if="isType(types.ACCOUNT_OPERATION_RESTRICTION, view)" :view="view" />
        <Alias v-if="isType(types.ADDRESS_ALIAS, view) || isType(types.MOSAIC_ALIAS, view)" :view="view" />
        <HashLock v-if="isType(types.HASH_LOCK, view)" :view="view" />
        <MosaicAddressRestriction v-if="isType(types.MOSAIC_ADDRESS_RESTRICTION, view)" :view="view" />
        <MosaicDefinition v-if="isType(types.MOSAIC_DEFINITION, view)" :view="view" />
        <MosaicGlobalRestriction v-if="isType(types.MOSAIC_GLOBAL_RESTRICTION, view)" :view="view" />
        <MosaicMetadata v-if="isType(types.MOSAIC_METADATA, view)" :view="view" />
        <MosaicSupplyChange v-if="isType(types.MOSAIC_SUPPLY_CHANGE, view)" :view="view" />
        <MultisigAccountModification v-if="isType(types.MULTISIG_ACCOUNT_MODIFICATION, view)" :view="view" />
        <NamespaceMetadata v-if="isType(types.NAMESPACE_METADATA, view)" :view="view" />
        <NamespaceRegistration v-if="isType(types.NAMESPACE_REGISTRATION, view)" :view="view" />
        <SecretLock v-if="isType(types.SECRET_LOCK, view)" :view="view" />
        <SecretProof v-if="isType(types.SECRET_PROOF, view)" :view="view" />
        <Transfer v-if="isType(types.TRANSFER, view)" :view="view" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { TransactionDetailsTs } from './TransactionDetailsTs'
export default class TransactionDetails extends TransactionDetailsTs {}
</script>

<style lang="less">
@import "./TransactionDetails.less";
</style>
