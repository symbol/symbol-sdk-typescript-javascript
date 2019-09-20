<template>
  <div class="walletCreateWrap">
    <div class="createDiv">
      <div class="createForm">
        <p class="formTit">{{$t('create_seed')}}</p>
        <Form :model="formItem" label-position="top">
          <FormItem :label="$t('choose_network')">
            <p class="formItemTxt">
              {{$t('In_the_nem2_ecosystem_you_can_build_your_own_home_wallet_or_private_network_wallet_or_test_the_network_such_as_Mainnet_Testnet_different_wallet_address_prefixes_generated_under_different_networks')}}</p>
            <Select :placeholder="$t('choose_network')" v-model="formItem.currentNetType" required>
              <Option :value="item.value" v-for="(item,index) in networkTypeList" :key="index">{{item.label}}</Option>
            </Select>
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
    <CheckPasswordDialog
            :showCheckPWDialog="showCheckPWDialog"
            :isOnlyCheckPassword="true"
            @closeCheckPWDialog="closeCheckPWDialog"
            @checkEnd="checkEnd"
    ></CheckPasswordDialog>
  </div>
</template>

<script lang="ts">
    import './AccountCreateMnemonic.less'
    //@ts-ignore
    import {AccountCreateMnemonicTs} from '@/views/login/init-seed/account-create-mnemonic/AccountCreateMnemonicTs.ts'

    export default class AccountCreateMnemonic extends AccountCreateMnemonicTs {

    }
</script>

<style scoped>

</style>
