<template>
  <div>
    <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
      <div class="privatekey">
        <div
          class="describe"
        >
          {{ $t('the_private_key_is_a_string_of_64_bit_random') }}
        </div>
        <ul>
          <li>
            {{ $t('private_key_string') }}
            <div class="tips">
              {{ $t('Please_paste_the_private_key_string_in_the_input_box_below') }}
            </div>
            <div class="gray_content textarea">
              <ErrorTooltip field-name="privateKey">
                <textarea
                  v-model="formItems.privateKey"
                  v-focus
                  v-validate="validation.privateKey"
                  :placeholder="$t('Paste_the_private_key_string_in_the_input_box')"
                  :data-vv-as="$t('private_key_string')"
                  data-vv-name="privateKey"
                />
              </ErrorTooltip>
            </div>
          </li>

          <li>
            {{ $t('Only_one_type_of_wallet_can_be_created_in_one_account') }}
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
                  v-model="formItems.walletName"
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
        <span class="back left" @click="$emit('toWalletDetails')">{{ $t('back') }}</span>
        <span class="import right" @click="submit">{{ $t('import') }}</span>
      </div>
    </form>
    <CheckPasswordDialog
      v-if="showCheckPWDialog"
      :visible="showCheckPWDialog"
      :return-password="true"
      @close="showCheckPWDialog = false"
      @passwordValidated="passwordValidated"
    />
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { WalletImportPrivatekeyTs } from '@/views/wallet/wallet-functions/wallet-import/wallet-import-privatekey/WalletImportPrivatekeyTs.ts'

export default class WalletImportPrivatekey extends WalletImportPrivatekeyTs {}
</script>
<style scoped lang="less">
@import "WalletImportPrivatekey.less";
</style>
