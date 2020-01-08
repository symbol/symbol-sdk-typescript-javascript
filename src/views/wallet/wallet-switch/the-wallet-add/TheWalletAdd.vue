<template>
  <div class="checkPWDialogWrap">
    <Modal
      v-model="show"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      @on-cancel="$emit('close'); $emit('cancelled')"
    >
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('confirm_information_before_add_child_wallet')}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="row-item-container">
          <span>{{$t('Wallet_name')}}</span>
          <ErrorTooltip fieldName="walletName">
            <input
              v-model.lazy="walletName"
              v-validate="validation.walletName"
              data-vv-name="walletName"
              :data-vv-as="$t('walletName')"
              :placeholder="$t('please_enter_your_new_wallet_name')"
            />
          </ErrorTooltip>
        </div>
        <div class="row-item-container stepItem1">
          <span>{{$t('account_password')}}</span>
          <CheckPassword
            :returnPassword="true"
            @passwordValidated="passwordValidated" ></CheckPassword>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
import "./TheWalletAdd.less";
import { TheWalletAddTs } from "@/views/wallet/wallet-switch/the-wallet-add/TheWalletAddTs.ts";

export default class CheckPasswordDialog extends TheWalletAddTs {}
</script>

<style scoped>
</style>
