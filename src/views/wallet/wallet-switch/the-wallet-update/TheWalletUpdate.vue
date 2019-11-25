<template>
  <div class="checkPWDialogWrap" @keyup.enter="submit">
    <Modal
            v-model="show"
            class-name="vertical-center-modal"
            :footer-hide="true"
            :transfer="false"
            @on-cancel="updateDialogCancel">
      <div slot="header" class="checkPWDialogHeader">
        <span class="title">{{$t('update_wallet_name')}} : {{walletToUpdate.name}}</span>
      </div>
      <div class="checkPWDialogBody">
        <div class="stepItem1">
          <Form :model="wallet">
            <FormItem>
              <Input v-model="wallet.name"
                     required
                     :autofocus="true"
                     :placeholder="$t('please_enter_your_new_wallet_name')"/>
            </FormItem>
            <FormItem>
              <Button type="success" @click="submit"> {{$t('confirm')}}</Button>
            </FormItem>
            <input v-show="false">
          </Form>
        </div>
      </div>
    </Modal>
  </div>
</template>


<script lang="ts">
    import "./TheWalletUpdate.less"
    import {TheWalletUpdateTs} from '@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdateTs.ts'
    export default class TheWalletUpdate extends TheWalletUpdateTs { }
</script>
