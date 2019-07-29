<template>
  <div class="walletCreateWrap">
    <div class="createDiv">
      <div class="createForm">
        <p class="formTit">{{$t('create_wallet')}}</p>
        <Form :model="formItem" label-position="top">
          <FormItem :label="$t('choose_network')">
            <p class="formItemTxt">
              {{$t('In_the_nem2_ecosystem_you_can_build_your_own_home_wallet_or_private_network_wallet_or_test_the_network_such_as_Mainnet_Testnet_different_wallet_address_prefixes_generated_under_different_networks')}}</p>
            <Select :placeholder="$t('choose_network')"  v-model="formItem.currentNetType" required>
              <Option :value="item.value" v-for="(item,index) in netType" :key="index">{{item.label}}</Option>
            </Select>
          </FormItem>
          <FormItem :label="$t('set_the_wallet_name')">
            <p class="formItemTxt">
              {{$t('The_name_of_the_wallet_can_be_convenient_for_you_to_use_you_can_distinguish_different_wallets_etc_for_better_management_after_entering_the_system_you_can_also_modify_the_wallet_details')}}</p>
            <Input v-model="formItem.walletName" required
                   :placeholder="$t('Please_enter_the_name_of_the_wallet')"></Input>
          </FormItem>
          <FormItem :label="$t('set_password')">
            <p class="formItemTxt">
              {{$t('This_is_very_important_to_encrypt_your_private_key_Your_private_key_will_be_encrypted_and_stored_on_your_local_computer_Be_sure_to_back_up_your_private_key_separately_so_that_you_can_recover_it_if_you_forget_it_The_password_setting_requirement_is_not_less_than_six_digits_The_more_complicated_the_recommendation_the_better_which_is_beneficial_to_the_security_of_your_private_key')}}</p>
            <Input v-model="formItem.password" type="password" required
                   :placeholder="$t('please_set_your_wallet_password')"></Input>
            <!--<i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>-->
          </FormItem>
          <FormItem :label="$t('repeat_the_password')">
            <Input v-model="formItem.checkPW" type="password" required
                   :placeholder="$t('please_enter_your_password_again')"></Input>
            <!--<i class="icon"><img src="@/assets/images/wallet-management/psd_hidden.png"></i>-->
          </FormItem>
          <FormItem>
            <div class="clear">
<!--              <Button class="prev left" type="default" @click="toBack">{{$t('back')}}/....</Button>-->
<!--              <Button class="next right" type="success" @click="createWallet">{{$t('next')}}</Button>-->


              <Button  class="prev" type="default" @click="toBack">{{$t('back')}}</Button>
              <Button  class="right" type="success" @click="createWallet">{{$t('next')}}</Button>
            </div>
          </FormItem>
        </Form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import './WalletCreate.less'
    import {NetworkType} from "nem2-sdk";
    import {MnemonicPassPhrase} from 'nem2-hd-wallets';
    import Message from "@/message/Message";


    @Component({
        components: {},
    })
    export default class WalletCreate extends Vue{
        formItem = {
            currentNetType: '',
            walletName: '',
            password: '',
            checkPW: '',
        }
        netType = [
            {
                value:NetworkType.MIJIN_TEST,
                label:'MIJIN_TEST'
            },{
                value:NetworkType.MAIN_NET,
                label:'MAIN_NET'
            },{
                value:NetworkType.TEST_NET,
                label:'TEST_NET'
            },{
                value:NetworkType.MIJIN,
                label:'MIJIN'
            },
        ]

        checkInput () {
            if (!this.formItem.currentNetType || this.formItem.currentNetType == '') {
                this.$Message.error(Message.PLEASE_SWITCH_NETWORK);
                return false
            }
            if (!this.formItem.walletName || this.formItem.walletName == '') {
                this.$Message.error(Message.WALLET_NAME_INPUT_ERROR);
                return false
            }
            if (!this.formItem.password || this.formItem.password == '') {
                this.$Message.error(Message.PASSWORD_SETTING_INPUT_ERROR);
                return false
            }
            if (this.formItem.password !== this.formItem.checkPW) {
                this.$Message.error(Message.INCONSISTENT_PASSWORD_ERROR);
                return false
            }
            return true
        }

        createMnemonic () {
            const mnemonic = MnemonicPassPhrase.createRandom('english', 128);
            this.$store.commit('SET_MNEMONIC',mnemonic.plain)
        }

        createWallet () {
            if(!this.checkInput()) return
            this.createMnemonic()
            this.$emit('isCreated', this.formItem)
        }
        toBack () {
            this.$emit('closeCreate')
        }
    }
</script>

<style scoped>

</style>
