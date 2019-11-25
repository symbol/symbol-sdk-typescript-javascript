<template>
  <div>
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="privatekey">
        <div
          class="describe"
        >{{$t('the_private_key_is_a_string_of_64_bit_random_strings_which_is_the_absolute_control_of_the_account_Please_keep_it_safe')}}</div>
        <ul>
          <li>
            {{$t('private_key_string')}}
            <div class="tips">{{$t('Please_paste_the_private_key_string_in_the_input_box_below')}}</div>
            <div class="gray_content textarea">
              <ErrorTooltip fieldName="privateKey">
                <textarea
                  v-focus
                  v-model="formItems.privateKey"
                  v-validate="validation.privateKey"
                  :placeholder="$t('Paste_the_private_key_string_in_the_input_box')"
                  :data-vv-as="$t('private_key_string')"
                  data-vv-name="privateKey"
                />
              </ErrorTooltip>
            </div>
          </li>

          <li>
            {{$t('Only_one_type_of_wallet_can_be_created_in_one_account_If_you_want_to_use_a_wallet_with_different_network_types_please_create_an_account_of_another_network_type_first')}}
            <div
              class="gray_content un_click account-network-type"
            >{{NetworkType[accountNetworkType]}}</div>
          </li>
          <li>
            {{$t('set_the_wallet_name')}}
            <div class="gray_content">
              <ErrorTooltip fieldName="walletName">
                <input
                  class="absolute"
                  v-validate="'required'"
                  type="text"
                  v-model="formItems.walletName"
                  :placeholder="$t('set_the_wallet_name')"
                  :data-vv-as="$t('wallet_name')"
                  data-vv-name="walletName"
                />
              </ErrorTooltip>
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom_button">
        <span class="back left" @click="$emit('toWalletDetails')">{{$t('back')}}</span>
        <span class="import right" @click="submit">{{$t('import')}}</span>
      </div>
    </form>
    <CheckPasswordDialog
      v-if="showCheckPWDialog"
      :visible="showCheckPWDialog"
      :returnPassword="true"
      @close="showCheckPWDialog = false"
      @passwordValidated="passwordValidated"
    />
  </div>
</template>

<script lang="ts">
//@ts-ignore
import { WalletImportPrivatekeyTs } from "@/views/wallet/wallet-functions/wallet-import/wallet-import-privatekey/WalletImportPrivatekeyTs.ts";

export default class WalletImportPrivatekey extends WalletImportPrivatekeyTs {}
</script>
<style scoped lang="less">
@import "WalletImportPrivatekey.less";
</style>
