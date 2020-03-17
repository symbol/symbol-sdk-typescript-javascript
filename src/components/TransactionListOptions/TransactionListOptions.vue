<template>
  <div class="transaction-list-options-container">
    <SignerSelector
      v-if="currentTab === 'partial'"
      v-model="selectedSigner"
      :signers="signers"
      :no-label="true"
      @change="onSignerSelectorChange"
    />
    <div v-if="currentTab === 'partial'" class="transaction-list-options-button-container">
      <button
        class="button-style validation-button submit-button"
        @click="refresh(chosenSigner)"
      >
        {{ $t('refresh') }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListOptionsTs } from './TransactionListOptionsTs'
import './TransactionListOptions.less'

export default class TransactionListOptions extends TransactionListOptionsTs {}
</script>

<style lang="less">
.ivu-tabs-nav-right {
  width: 5.8rem;
  display: grid;
  padding-top: 0.15rem;
  .transaction-list-options-container {
    width: 100%;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 4rem 1.5rem;
    column-gap: 0.2rem;
      .form-row-inner-container-value-only {
        grid-template-columns: unset;
      }
    .form-row {
      width: 100%;
      grid-template-columns: unset;
      margin: unset;
      grid-template-columns: unset;
    }

    .inputs-container {
      width: 100%;
    }
  }
}
</style>
