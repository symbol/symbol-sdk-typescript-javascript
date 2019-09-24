<template>
  <div class="checkPWDialogWrap">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            @on-cancel="checkPasswordDialogCancel"
    >
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('delete_wallet')}} : {{walletToDelete.name}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">
          <div class="checkPWImg">
            <img src="@/common/img/wallet/walletDeleteIcon.png">
          </div>
          <p class="checkRemind">
            {{$t('delete_wallet_tip', {walletName :getWallet.name})}}
            {{$t('delete_wallet_tip')}}</p>
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.password" type="password" required
                     :placeholder="$t('please_enter_your_wallet_password')"></Input>
            </FormItem>
            <FormItem>
              <Button type="success" @click="submit"> {{$t('confirm')}}</Button>
            </FormItem>
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
    import "./TheWalletDelete.less"
    import {TheWalletDeleteTs} from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDeleteTs.ts'

    /**
     @Prop: showCheckPWDialog
     @return: closeCheckPWDialog()
     @return: checkEnd(privatekey:string)
     */

    export default class TheWalletDelete extends TheWalletDeleteTs {
    }
</script>

<style scoped>
</style>
