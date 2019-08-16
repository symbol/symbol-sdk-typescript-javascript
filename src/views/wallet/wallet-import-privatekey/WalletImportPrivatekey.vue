<template>
  <div>
    <div class="privatekey">
      <div class="describle">
        {{$t('the_private_key_is_a_string_of_256_bit_random_strings_which_is_the_absolute_control_of_the_account_Please_keep_it_safe')}}
      </div>
      <ul>
        <li>
          {{$t('private_key_string')}}
          <div class="tips">
            {{$t('Please_paste_the_private_key_string_in_the_input_box_below')}}
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" v-model="form.privateKey"
                      :placeholder="$t('Paste_the_private_key_string_in_the_input_box')"/>
          </div>
        </li>

        <li>
          {{$t('choose_network')}}
          <div class="gray_content">
            <Select v-model="form.networkType" :placeholder="$t('choose_network')">
              <Option v-for="item in NetworkTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </li>
        <li>
          {{$t('set_the_wallet_name')}}
          <div class="gray_content">
            <input class="absolute" type="text" v-model="form.walletName"
                   :placeholder="$t('set_the_wallet_name')">
          </div>
        </li>

        <li>
          {{$t('set_password')}}
          <div class="tips">
            {{$t('This_password_is_a_private_key_password_and_will_be_used_when_you_pay')}}
          </div>
          <p class="formItemTxt">{{$t('password_hint', {min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH, specialChar: ALLOWED_SPECIAL_CHAR})}}</p>
          <div class="gray_content">
            <input class="absolute" v-model="form.password" type="password"
                   :placeholder="$t('please_set_your_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" v-model="form.checkPW" type="password"
                   :placeholder="$t('please_enter_your_wallet_password_again')">
          </div>
        </li>
      </ul>


    </div>
    <div class="bottom_button ">
      <span class="back left" @click="toBack"> {{$t('back')}}</span>
      <span class="import right" @click="importWallet">{{$t('import')}}</span>
    </div>
  </div>
</template>

<script lang="ts">
    import {WalletImportPrivatekeyTs} from './WalletImportPrivatekeyTs'

    export default class WalletImportPrivatekey extends WalletImportPrivatekeyTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportPrivatekey.less";
</style>
