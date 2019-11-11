<template>
  <div class="transactionConfirmationWrap">
    <Modal
      v-if="show"
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      >

      <div slot="header" class="transactionConfirmationHeader">
        <span class="title">{{$t('confirm_information')}}</span>
      </div>
      <div class="transactionConfirmationBody">
        <div class="stepItem1">
          <div class="info_container">
            <TransactionSummary
              :formattedTransaction="formattedTransaction"
            >
            </TransactionSummary>
          </div>


          <form @keyup.enter="submit">
            <div v-if="wallet.sourceType === walletTypes.trezor">
              <Button
                type="success"
                @click="confirmTransactionViaTrezor"
                v-if="wallet.sourceType === walletTypes.trezor"
              >
                {{$t('trezor_confirm_transaction_prompt')}}
              </Button>
            </div>
            <div v-else>
              <input v-model="password" type="password" required
                    :placeholder="$t('please_enter_your_wallet_password')"/>
              <Button type="success" @click="submit">{{$t('confirm')}}</Button>
              <input v-show="false" type="text">
            </div>
          </form>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang="ts">
    import "./TransactionConfirmation.less"
    import {TransactionConfirmationTs} from '@/components/transaction-confirmation/TransactionConfirmationTs.ts'

    export default class TransactionConfirmation extends TransactionConfirmationTs {
    }
</script>

<style scoped>
</style>
