<template>
  <div class="transaction-list-options-container">
    <div v-if="signers && signers.length > 1">
      <div v-if="!showSignerSelector" class="show-signer-selector">
        <span @click="showSignerSelector = true">
          {{ $t('see_transactions_other_account') }}
        </span>
      </div>
      <SignerSelector
        v-else
        v-model="selectedSigner"
        :signers="signers"
        :no-label="true"
        @input="onSignerSelectorChange"
      />
    </div>
    <div v-else>
      &nbsp;
    </div>
    <Icon @click="refresh" type="md-refresh" class="refresh-button" size="30" />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionListOptionsTs } from './TransactionListOptionsTs'
import './TransactionListOptions.less'

export default class TransactionListOptions extends TransactionListOptionsTs {}
</script>

<style lang="less">
@import '../../views/resources/css/variables.less';

.ivu-tabs-nav-right {
  width: 4.8rem;
  display: grid;
  padding-top: 0.15rem;
  
  .transaction-list-options-container {
    width: 100%;
    display: grid;
    grid-template-rows: 100%;
    grid-template-columns: 4rem 0.8rem;

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

    .show-signer-selector {
      display: grid;
      align-content: center;
      text-align: center;
      cursor: pointer;
      font-size: @smallFont;
      height: 100%;
      color: @secondary;
      text-decoration: underline;
    }
  }

  .refresh-button {
    color: @secondary;
  }
}
</style>
