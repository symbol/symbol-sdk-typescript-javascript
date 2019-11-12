<template>
  <div>
    <div class="mnemonic"  @keyup.enter="submit">
      <div class="page_import_title">{{$t('Import_mnemonic')}}</div>
      <div class="describe">{{$t('mnemonic_description')}}</div>
      <ul>
        <li>
          <div class="title_info">
          {{$t('input_mnemonic')}}
          <div class="tips">
            {{$t('enter_24_words_please_pay_attention_to_the_order_separated_by_a_space_between_each_word')}}
          </div>
          </div>
          <div class="gray_content textarea">
            <textarea v-focus class="absolute" v-model="form.mnemonic"/>
          </div>
        </li>

        <li>
          <div class="title_info">
          {{$t('Only_one_type_of_wallet_can_be_created_in_one_account_If_you_want_to_use_a_wallet_with_different_network_types_please_create_an_account_of_another_network_type_first')}}
          </div>
          <div class="gray_content">
            <div class=" un_click account-network-type">
              {{NetworkType[accountNetworkType]}}
            </div>
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
    import {AccountImportMnemonicTs} from '@/views/login/init-seed/account-import-mnemonic/AccountImportMnemonicTs.ts'
    import "./AccountImportMnemonic.less"
    export default class WalletImportMnemonic extends AccountImportMnemonicTs {

    }
</script>
<style scoped lang="less">
</style>
