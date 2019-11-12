<template>

  <div>
    <div class="keystore" @keyup.enter="submit">
      <div class="describe">{{$t('keyStore_description')}}</div>
      <ul>
        <li>
          {{$t('keystore_string')}}
          <div class="tips">
            {{$t('keystore_description_import')}}
          </div>
          <!--          TODO LOAD FILE-->
          <!--          <div class="gray_content">-->
          <!--            <Select v-model="file" :placeholder="$t('please_choose')">-->
          <!--              <Option v-for="item in fileList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
          <!--            </Select>-->
          <!--          </div>-->
          <div class="gray_content textarea">
            <textarea class="absolute" v-focus v-model="formItem.keystoreStr" :placeholder="$t('keystore_text')"/>
          </div>
        </li>


        <li>
          {{$t('input_keystore_password')}}
          <div class="tips">
            {{$t('keystore_description_text')}}
          </div>
          <div class="gray_content">
            <input class="absolute" v-model="formItem.keystorePassword" type="password"
                   :placeholder="$t('please_enter_your_keystore_password')">
          </div>
        </li>

        <li>
          {{$t('Only_one_type_of_wallet_can_be_created_in_one_account_If_you_want_to_use_a_wallet_with_different_network_types_please_create_an_account_of_another_network_type_first')}}
          <div class="gray_content un_click account-network-type">
            {{NetworkType[accountNetworkType]}}
          </div>
        </li>

        <li>
          {{$t('set_the_wallet_name')}}
          <div class="gray_content">
            <input class="absolute" type="text" v-model="formItem.walletName"
                   :placeholder="$t('set_the_wallet_name')">
          </div>
        </li>
      </ul>
    </div>
    <div class="bottom_button ">
      <span class="back left pointer" @click="$emit('toWalletDetails')"> {{$t('back')}}</span>
      <span class="import right" @click="submit">{{$t('import')}}</span>
    </div>

    <CheckPasswordDialog
            :showCheckPWDialog="showCheckPWDialog"
            :isOnlyCheckPassword="true"
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    ></CheckPasswordDialog>
  </div>

</template>

<script lang="ts">
    //@ts-ignore
    import {WalletImportKeystoreTs} from '@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystoreTs.ts'

    export default class WalletImportKeystore extends WalletImportKeystoreTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportKeystore.less";
</style>
