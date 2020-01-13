<template>
  <div class="hardware_import_container">
    <div class="page_import_title">
      {{ $t('connect_trezor_title') }}
    </div>
    <div class="describe">
      {{ $t('trezor_description') }}
    </div>
    <ul>
      <li>
        {{ $t('choose_network') }}
        <div class="gray_content">
          <Select v-model="trezorForm.networkType" :placeholder="$t('choose_network')" @on-change="onNetworkSelected">
            <Option v-for="item in NetworkTypeList" :key="item.value" :value="item.value">
              {{ item.label }}
            </Option>
          </Select>
        </div>
      </li>
      <li>
        {{ $t('choose_account_index') }}
        <div class="gray_content">
          <input
            v-model="trezorForm.accountIndex" class="absolute" type="number"
            min="0" max="1000000"
            :placeholder="$t('choose_account_index')"
          >
        </div>
      </li>
      <li>
        {{ $t('set_the_wallet_name') }}
        <div class="gray_content">
          <input
            v-model="trezorForm.walletName" class="absolute" type="text"
            :placeholder="$t('set_the_wallet_name')"
          >
        </div>
      </li>
    </ul>

    <div class="bottom_button ">
      <span class="back left" @click="toBack"> {{ $t('back') }}</span>
      <span class="import right" @click="importAccountFromTrezor">{{ $t('connect_trezor_prompt') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { WalletImportHardwareTs } from '@/views/wallet/wallet-functions/wallet-import/wallet-import-hardware/WalletImportHardwareTs.ts'
import './WalletImportHardware.less'
export default class WalletImportHardware extends WalletImportHardwareTs { }
</script>
