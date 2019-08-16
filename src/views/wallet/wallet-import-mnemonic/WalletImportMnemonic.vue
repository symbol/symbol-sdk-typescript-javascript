<template>
  <div>
    <div class="mnemonic">
      <div class="describle">{{$t('mnemonic_describle')}}</div>
      <ul>
        <li>
          {{$t('input_mnemonic')}}
          <div class="tips">
            {{$t('enter_12_words_please_pay_attention_to_the_order_separated_by_a_space_between_each_word')}}
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" v-model="form.mnemonic"/>
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
            {{$t('mnemonic_describle_tips')}}
          </div>
          <p class="formItemTxt">{{$t('password_hint', {min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH, specialChar: ALLOWED_SPECIAL_CHAR})}}</p>
          <div class="gray_content">
            <input class="absolute" type="password" v-model="form.password"
                   :placeholder="$t('please_set_your_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" type="password" v-model="form.checkPW"
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
    import {WalletImportMnemonicTs} from './WalletImportMnemonicTs'

    export default class WalletImportMnemonic extends WalletImportMnemonicTs {

    }
</script>
<style scoped lang="less">
  @import "WalletImportMnemonic";
</style>
