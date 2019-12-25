<template>
  <div class="delete_wallet_container">
    <Modal
      v-model="visible"
      class-name="vertical-center-modal"
      :footer-hide="true"
      :transfer="false"
      @on-cancel="visible=false"
    >
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('delete_wallet')}} : {{walletToDelete.name}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">
          <div class="checkPWImg">
            <img src="@/common/img/wallet/walletDeleteIcon.png">
          </div>
          <p class="checkRemind">{{$t('delete_wallet_tip', {walletName :walletToDelete.name})}}</p>
          <p v-if="walletList.length == 1" class="checkRemind orange">
            {{$t('this_account_will_be_logged_out_after_the_wallet_is_successfully_deleted')}}</p>
          <CheckPassword
            :returnPassword="true"
            @passwordValidated="passwordValidated"
          ></CheckPassword>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
  import "./TheWalletDelete.less"
  import {TheWalletDeleteTs} from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDeleteTs.ts'

  export default class TheWalletDelete extends TheWalletDeleteTs {
  }
</script>
