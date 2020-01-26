<template>
  <div class="transactionConfirmationWrap">
    <Modal
      v-if="show"
      v-model="show"
      :title="$t('transaction_details')"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
    >
      <div slot="header" class="transactionConfirmationHeader">
        <span class="title">{{ $t('confirm_information') }}</span>
      </div>
      <div class="transactionConfirmationBody">
        <div class="stepItem1">
          <div class="info_container">
            <TransactionDetails :transaction="formattedTransaction" />
          </div>

          <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
            <div v-if="wallet.sourceType === CreateWalletType.trezor">
              <Button
                v-if="wallet.sourceType === CreateWalletType.trezor"
                type="success"
                @click="confirmTransactionViaTrezor"
              >
                {{ $t('trezor_confirm_transaction_prompt') }}
              </Button>
            </div>
            <div v-else>
              <input
                v-model.lazy="password" type="password" required
                :placeholder="$t('please_enter_your_wallet_password')"
              >
              <button class="radius" type="success" @click="submit">
                {{ $t('confirm') }}
              </button>
              <input v-show="false" type="text">
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
import './TransactionConfirmation.less'
import {TransactionConfirmationTs} from '@/components/transaction-confirmation/TransactionConfirmationTs.ts'

export default class TransactionConfirmation extends TransactionConfirmationTs {
}
</script>

<style scoped>
</style>
