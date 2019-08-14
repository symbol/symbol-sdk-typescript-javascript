<template>
  <div class="walletCreateWrap">
    <div class="createDiv">
      <div class="createForm">
        <p class="formTit">{{$t('create_wallet')}}</p>
        <Form :model="formItem" label-position="top">
          <FormItem :label="$t('choose_network')">
            <p class="formItemTxt">
              {{$t('In_the_nem2_ecosystem_you_can_build_your_own_home_wallet_or_private_network_wallet_or_test_the_network_such_as_Mainnet_Testnet_different_wallet_address_prefixes_generated_under_different_networks')}}</p>
            <Select :placeholder="$t('choose_network')" v-model="formItem.currentNetType" required>
              <Option :value="item.value" v-for="(item,index) in netType" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('set_the_wallet_name')">
            <p class="formItemTxt">
              {{$t('The_name_of_the_wallet_can_be_convenient_for_you_to_use_you_can_distinguish_different_wallets_etc_for_better_management_after_entering_the_system_you_can_also_modify_the_wallet_details')}}</p>
            <Input v-model="formItem.walletName"
                   :placeholder="$t('Please_enter_the_name_of_the_wallet')" />
          </FormItem>
          <FormItem :label="$t('set_password')">
            <p class="formItemTxt">
              {{$t('This_password_is_used_to_encrypt_your_private_key')}}</p>
            <p class="formItemTxt">
              {{$t('password_hint', {min: MIN_PASSWORD_LENGTH, max: MAX_PASSWORD_LENGTH, specialChar: ALLOWED_SPECIAL_CHAR})}}</p>
            <Input v-model="formItem.password" type="password" required
                   :placeholder="$t('please_set_your_wallet_password')" />
          </FormItem>
          <FormItem :label="$t('repeat_the_password')">
            <Input v-model="formItem.checkPW" type="password" required
                   :placeholder="$t('please_enter_your_password_again')" />
          </FormItem>
          <FormItem>
            <div class="clear">
              <Button class="prev" type="default" @click="toBack">{{$t('back')}}</Button>
              <Button class="right" type="success" @click="createWallet">{{$t('next')}}</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import './WalletCreate.less'
    import {WalletCreateTs} from './WalletCreateTs'

    export default class WalletCreate extends WalletCreateTs {

    }
</script>

<style scoped>

</style>
