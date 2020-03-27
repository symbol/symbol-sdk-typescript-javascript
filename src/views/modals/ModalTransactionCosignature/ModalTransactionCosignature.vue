<template>
  <div class="transaction_modal">
    <Modal
      v-model="show"
      :title="$t('modal_title_transaction_details')"
      :transfer="false"
      @close="show = false"
    >
      <TransactionDetails :transaction="transaction" />

      <div v-if="cosignatures && cosignatures.length">
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_has_cosignature') }}</span>
          <div
            v-for="(cosignature, index) in cosignatures" :key="index"
            class="row-cosignatory-modification-display-cosignature accent-pink-background inputs-container mx-1"
          >
            <div>
              <Icon :type="'md-checkbox-outline'" size="20" />
              <span>{{ $t('label_signed_by') }}</span>
              <span><b>{{ cosignature.signer.publicKey }}</b></span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!needsCosignature">
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
          <p>{{ $t('transaction_needs_cosignature_explain_signed') }}</p>
        </div>
      </div>
      <div v-else>
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
          <p>{{ $t('transaction_needs_cosignature_explain') }}</p>
        </div>

        <HardwareConfirmationButton 
          v-if="isUsingHardwareWallet" 
          @success="onTransactionsSigned"
          @error="onError"
        />
        <FormAccountUnlock 
          v-else
          @success="onAccountUnlocked"
          @error="onError"
        />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import {ModalTransactionCosignatureTs} from './ModalTransactionCosignatureTs'
import './ModalTransactionCosignature.less'

export default class ModalTransactionCosignature extends ModalTransactionCosignatureTs {}
</script>
