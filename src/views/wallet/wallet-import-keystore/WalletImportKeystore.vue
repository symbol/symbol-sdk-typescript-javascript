<template>

  <div>
    <div class="keystore">
      <div class="describle">{{$t('keyStore_describle')}}</div>
      <ul>
        <li>
          {{$t('keystore_string')}}
          <div class="tips">
            {{$t('keystore_describle_import')}}
          </div>
          <!--          TODO LOAD FILE-->
          <!--          <div class="gray_content">-->
          <!--            <Select v-model="file" :placeholder="$t('please_choose')">-->
          <!--              <Option v-for="item in fileList" :value="item.value" :key="item.value">{{ item.label }}</Option>-->
          <!--            </Select>-->
          <!--          </div>-->
          <div class="gray_content textarea">
            <textarea class="absolute" v-model="formItem.keystoreStr" :placeholder="$t('keystore_text')"/>
          </div>
        </li>


        <li>
          {{$t('input_keystore_password')}}
          <div class="tips">
            {{$t('keystore_describle_text')}}
          </div>
          <div class="gray_content">
            <input class="absolute" v-model="formItem.keystorePassword" type="password"
                   :placeholder="$t('please_enter_your_keystore_password')">
          </div>
        </li>

        <li>
          {{$t('choose_network')}}
          <div class="gray_content">
            <Select v-model="formItem.networkType" :placeholder="$t('choose_network')">
              <Option v-for="item in NetworkTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </li>

        <li>
          {{$t('set_the_wallet_name')}}
          <div class="gray_content">
            <input class="absolute" type="text" v-model="formItem.walletName"
                   :placeholder="$t('set_the_wallet_name')">
          </div>
        </li>

        <li>
          {{$t('set_password')}}
          <div class="tips">
            {{$t('This_password_is_used_to_encrypt_your_private_key')}}
          </div>
          <p class="formItemTxt">{{$t('password_hint', {min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH, specialChar: ALLOWED_SPECIAL_CHAR})}}</p>
          <div class="gray_content">
            <input class="absolute" v-model="formItem.walletPassword" type="password"
                   :placeholder="$t('please_set_your_password')">
          </div>
        </li>

        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="password" v-model="formItem.walletPasswordAgain"
                   :placeholder="$t('please_enter_your_wallet_password_again')">
          </div>
        </li>
      </ul>


    </div>
    <div class="bottom_button ">
      <span class="back left pointer" @click="toBack"> {{$t('back')}}</span>
      <span class="import right" @click="importWallet">{{$t('import')}}</span>
    </div>
  </div>

</template>

<script lang="ts">
    //@ts-ignore
    import {WalletImportKeystoreTs} from '@/views/wallet/wallet-import-keystore/WalletImportKeystoreTs.ts'

    export default class WalletImportKeystore extends WalletImportKeystoreTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportKeystore.less";
</style>
