<template>
  <div class="walletCreateWrap">
    <div class="createDiv">
      <div class="createForm" @keyup.enter="submit">
        <p class="formTit">{{$t('create_wallet')}}</p>
        <Form :model="formItem" label-position="top">
          <FormItem :label="$t('Only_one_type_of_wallet_can_be_created_in_one_account_If_you_want_to_use_a_wallet_with_different_network_types_please_create_an_account_of_another_network_type_first')">
            <div class="account-network-type un_click radius">{{NetworkType[accountNetworkType]}}</div>
          </FormItem>
          <FormItem :label="$t('set_the_wallet_name')">
            <p class="formItemTxt">
              {{$t('The_name_of_the_wallet_can_be_convenient_for_you_to_use_you_can_distinguish_different_wallets_etc_for_better_management_after_entering_the_system_you_can_also_modify_the_wallet_details')}}</p>
            <Input :autofocus="true" v-model="formItem.walletName"
                   :placeholder="$t('Please_enter_the_name_of_the_wallet')"/>
          </FormItem>
          <FormItem :label="$t('set_wallet_path')">
            <Input v-model="formItem.path" required
                   :placeholder="$t('please_set_your_wallet_path')"/>
          </FormItem>
          <FormItem>
            <div class="clear">
              <Button class="prev" type="default" @click="$emit('toWalletDetails')">{{$t('back')}}</Button>
              <Button class="right" type="success" @click="submit">{{$t('next')}}</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
    <CheckPasswordDialog
      v-if="showCheckPWDialog"
      :visible="showCheckPWDialog"
      :returnPassword="true"
      @close="close"
      @passwordValidated="passwordValidated"
    />
  </div>
</template>

<script lang="ts">
    import './WalletCreate.less'
    //@ts-ignore
    import {WalletCreateTs} from '@/views/wallet/wallet-functions/wallet-create/WalletCreateTs.ts'

    export default class WalletCreate extends WalletCreateTs {

    }
</script>

<style scoped>

</style>
