<template>
  <div>
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="keystore">
        <div class="describe">
          {{ $t('keyStore_description') }}
        </div>
        <ul>
          <li>
            {{ $t('keystore_string') }}
            <div class="tips">
              {{ $t('keystore_description_import') }}
            </div>
            <div class="gray_content textarea">
              <ErrorTooltip field-name="keystoreStr">
                <textarea
                  v-model="formItem.keystoreStr"
                  v-focus
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
            {{ $t('input_keystore_password') }}
            <div class="tips">
              {{ $t('keystore_description_text') }}
            </div>
            <div class="gray_content">
              <ErrorTooltip field-name="keystorePassword">
                <input
                  v-model.lazy="formItem.keystorePassword"
                  v-validate="'required'"
                  class="absolute"
                  type="password"
                  :placeholder="$t('please_enter_your_keystore_password')"
                  :data-vv-as="$t('Keystore_password')"
                  data-vv-name="keystorePassword"
                >
              </ErrorTooltip>
            </div>
          </li>

          <li>
            {{ $t('Network_type') }}
            <div
              class="tips"
            >
              {{ $t('Only_one_type_of_wallet_can_be_created_in_one_account') }}
            </div>
            <div
              class="gray_content un_click account-network-type"
            >
              {{ NetworkType[accountNetworkType] }}
            </div>
          </li>

          <li>
            {{ $t('set_the_wallet_name') }}
            <div class="gray_content">
              <ErrorTooltip field-name="walletName">
                <input
                  v-model="formItem.walletName"
                  v-validate="'required'"
                  class="absolute"
                  type="text"
                  :placeholder="$t('set_the_wallet_name')"
                  :data-vv-as="$t('wallet_name')"
                  data-vv-name="walletName"
                >
              </ErrorTooltip>
            </div>
          </li>
        </ul>
      </div>
      <div class="bottom_button">
        <span class="back left pointer" @click="$emit('toWalletDetails')">{{ $t('back') }}</span>
        <span class="import right" @click="submit">{{ $t('import') }}</span>
      </div>
    </form>

    <CheckPasswordDialog
      v-if="showCheckPWDialog"
      :visible="showCheckPWDialog"
      :return-password="true"
      @passwordValidated="passwordValidated"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { WalletImportKeystoreTs } from '@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystoreTs.ts'

export default class WalletImportKeystore extends WalletImportKeystoreTs {}
</script>
<style scoped lang="less">
@import "WalletImportKeystore.less";
</style>
