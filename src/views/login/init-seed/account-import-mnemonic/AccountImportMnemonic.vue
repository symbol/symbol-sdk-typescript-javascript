<template>
  <div>
    <div class="mnemonic">
      <div class="page_import_title">{{$t('Import_mnemonic')}}</div>
      <div class="describle">{{$t('mnemonic_description')}}</div>
      <ul>
        <li>
          <div class="title_info">
          {{$t('input_mnemonic')}}
          <div class="tips">
            {{$t('enter_24_words_please_pay_attention_to_the_order_separated_by_a_space_between_each_word')}}
          </div>
          </div>
          <div class="gray_content textarea">
            <textarea class="absolute" v-model="form.mnemonic"/>
          </div>
        </li>

        <li>
          <div class="title_info">
          {{$t('choose_network')}}
          </div>
          <div class="gray_content">
            <Select v-model="form.networkType" :placeholder="$t('choose_network')">
              <Option v-for="item in NetworkTypeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </div>
        </li>
        <li>
          <div class="title_info">
          {{$t('set_the_wallet_name')}}
          </div>
          <div class="gray_content">
            <input class="absolute" type="text" v-model="form.walletName"
                   :placeholder="$t('set_the_wallet_name')">
          </div>
        </li>
      </ul>

      <div class="bottom_button ">
        <span class="back left" @click="toBack"> {{$t('back')}}</span>
        <span class="import right" @click="submit">{{$t('import')}}</span>
      </div>
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
    import {AccountImportMnemonicTs} from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonicTs.ts'
    import "./AccountImportMnemonic.less"
    export default class WalletImportMnemonic extends AccountImportMnemonicTs {

    }
</script>
<style scoped lang="less">
</style>
