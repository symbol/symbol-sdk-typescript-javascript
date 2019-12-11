<template>
  <div>
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="keystore">
        <div class="describe">{{$t('keyStore_description')}}</div>
        <ul>
          <li>
            {{$t('keystore_string')}}
            <div class="tips">{{$t('keystore_description_import')}}</div>
            <!--          TODO LOAD FILE-->
            <!--          <div class="gray_content">-->
            <!--            <Select v-model="file" :placeholder="$t('please_choose')">-->
            <!--              <Option v-for="item in fileList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
            <!--            </Select>-->
            <!--          </div>-->
            <div class="gray_content textarea">
              <ErrorTooltip fieldName="keystoreStr">
                <textarea
                  v-focus
                  v-model="formItem.keystoreStr"
                  v-validate="'required'"
                  :placeholder="$t('keystore_text')"
                  :data-vv-as="$t('keystore_text')"
                  data-vv-name="keystoreStr"
                  style="display: block; height: 100%;"
                />
              </ErrorTooltip>
            </div>
          </li>

          <li>
            {{$t('input_keystore_password')}}
            <div class="tips">{{$t('keystore_description_text')}}</div>
            <div class="gray_content">
              <ErrorTooltip fieldName="keystorePassword">
                <input
                  class="absolute"
                  v-model.lazy="formItem.keystorePassword"
                  v-validate="'required'"
                  type="password"
                  :placeholder="$t('please_enter_your_keystore_password')"
                  :data-vv-as="$t('Keystore_password')"
                  data-vv-name="keystorePassword"
                />
              </ErrorTooltip>
            </div>
          </li>

          <li>
            {{$t('Network_type')}}
            <div
              class="tips"
            >{{$t('Only_one_type_of_wallet_can_be_created_in_one_account_If_you_want_to_use_a_wallet_with_different_network_types_please_create_an_account_of_another_network_type_first')}}</div>
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
                  type="text"
                  v-model="formItem.walletName"
                  :placeholder="$t('set_the_wallet_name')"
                  v-validate="'required'"
                  :data-vv-as="$t('wallet_name')"
                  data-vv-name="walletName"
                />
              </ErrorTooltip>
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom_button">
        <span class="back left pointer" @click="$emit('toWalletDetails')">{{$t('back')}}</span>
        <span class="import right" @click="submit">{{$t('import')}}</span>
      </div>
    </form>

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
//@ts-ignore
import { WalletImportKeystoreTs } from "@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystoreTs.ts";

export default class WalletImportKeystore extends WalletImportKeystoreTs {}
</script>
<style scoped lang="less">
@import "WalletImportKeystore.less";
</style>
