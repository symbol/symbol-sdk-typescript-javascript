<template>
  <div class="transaction_modal">
    <Modal
      v-model="show"
      class-name="modal-transaction-cosignature"
      :title="$t('modal_title_transaction_details')"
      :transfer="false"
      :footer-hide="true"
      @close="show = false"
    >
      <TransactionDetails :transaction="transaction" />

      <div v-if="cosignatures && cosignatures.length">
        <div class="explain">
          <span class="subtitle">{{ $t('transaction_has_cosignature') }}</span>
          <div
            v-for="(cosignature, index) in cosignatures"
            :key="index"
            class="row-cosignatory-modification-display-cosignature accent-pink-background inputs-container mx-1"
          >
            <div>
              <Icon :type="'md-checkbox-outline'" size="20" />
              <span>{{ $t('label_signed_by') }}</span>
              <span>
                <b>
                  {{ cosignature.signer.publicKey }}
                </b>
              </span>
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

        <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onSigner" @error="onError" />
        <FormProfileUnlock v-else @success="onAccountUnlocked" @error="onError" />
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import { ModalTransactionCosignatureTs } from './ModalTransactionCosignatureTs'
export default class ModalTransactionCosignature extends ModalTransactionCosignatureTs {}
</script>
<style lang="less" scoped>
@import '../../resources/css/variables.less';

/deep/.modal-transaction-cosignature {
  min-width: 8.5rem;
  max-width: 12rem;
  margin: 0 auto;
  overflow: hidden;
  .ivu-modal {
    width: 12rem !important;
  }

  .ivu-modal-content {
    width: 100%;
    max-height: 80vh;
    overflow-y: scroll;
  }

  .explain {
    padding: 0.2rem;
    padding-left: 0.4rem;
    font-size: @normalFont;

    .subtitle {
      color: @primary;
      font-weight: @boldest;
    }

    p {
      padding-top: 0.05rem;
      text-align: justify;
    }
  }
}

/deep/.modal-footer {
  height: 0.46rem;
  padding-right: 0.4rem;
}

.float-right {
  float: right;
}

.clear-staged-transactions {
  font-size: @smallFont;
  cursor: pointer;
}
</style>
