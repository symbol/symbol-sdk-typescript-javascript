<template>
  <div class="hardware_import_container">
    <div class="page_import_title">{{$t('connect_trezor_title')}}</div>
    <div class="describe">{{$t('trezor_description')}}</div>
    <ul>
      <li>
        <div class="title_info">
        {{$t('choose_network')}}
        </div>
        <div class="gray_content">
          <Select v-model="trezorForm.networkType" :placeholder="$t('choose_network')">
            <Option v-for="item in NetworkTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </div>
      </li>
      <li>
        <div class="title_info">
        {{$t('choose_account_index')}}
        </div>
        <div class="gray_content">
          <input class="absolute" type="number" min="0" max="1000000" v-model="trezorForm.accountIndex"
                  :placeholder="$t('choose_account_index')">

        </div>
      </li>
      <li>
        <div class="title_info">
        {{$t('set_the_wallet_name')}}
        </div>
        <div class="gray_content">
          <input class="absolute" type="text" v-model="trezorForm.walletName"
                  :placeholder="$t('set_the_wallet_name')">
        </div>
      </li>
    </ul>

    <div class="bottom_button ">
      <span class="back left" @click="toBack"> {{$t('back')}}</span>
      <span class="import right" @click="importAccountFromTrezor">{{$t('connect_trezor_prompt')}}</span>
    </div>
  </div>

</template>

<script lang="ts">
    //@ts-ignore
    import { AccountImportHardwareTs } from '@/views/login/init-seed/account-import-hardware/AccountImportHardwareTs.ts'
    import "./AccountImportHardware.less"
    export default class AccountImportHardware extends AccountImportHardwareTs {

    }
</script>
<style scoped lang="less">
</style>
