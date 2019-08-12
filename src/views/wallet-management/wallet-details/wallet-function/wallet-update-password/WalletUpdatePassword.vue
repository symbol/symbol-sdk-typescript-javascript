<template>
  <div class="update_wallet_password">

    <div class="left_input left">

      <div class="input_content">
        <span>{{$t('old_password')}}</span>
        <input type="password" v-model="prePassword" @input="changeBtnState" :placeholder="$t('please_enter_the_original_password')">
      </div>

      <div class="input_content">
        <span>{{$t('new_password')}}</span>
        <input type="password" v-model="newPassword" :placeholder="$t('please_enter_a_new_password')">
      </div>

      <div class="input_content">
        <span>{{$t('Confirm_the_password')}}</span>
        <input type="password" v-model="repeatPassword" :placeholder="$t('please_enter_your_new_password_again')">
      </div>


      <div :class="[btnState?'confirm_sure':'confirm_update', 'pointer']" @click="confirmUpdate">
        {{$t('confirm')}}
      </div>
    </div>

    <div :class="['right_tips','left',$i18n.locale === 'en-US'?'en':'']">

      <div class="tip_title">{{$t('tips')}}：</div>
      <div class="tip_content">
        {{$t('This_password_will_be_used_for_all_transactions_in_your_wallet_account_Please_remember_your_password_and_keep_it_safe')}}
      </div>
      <div class="tip_content">
        {{$t('The_password_setting_requirement_is_not_less_than_six_digits_The_more_complicated_the_recommendation_the_better_the_security_of_your_wallet')}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {localRead, localSave} from '@/utils/util'
    import Message from '@/message/Message'
    import {walletInterface} from "../../../../../interface/sdkWallet";
    import {decryptKey, encryptKey, saveLocalWallet} from "../../../../../help/appUtil";

    @Component
    export default class WalletUpdatePassword extends Vue {
        prePassword = ''
        newPassword = ''
        repeatPassword = ''
        privateKey = ''
        btnState = false

        get getWallet () {
            return this.$store.state.account.wallet
        }

        changeBtnState () {
            if(this.prePassword == ''){
                this.btnState = false
            }else {
                this.btnState = true
            }
        }

        checkInfo() {
            const {prePassword, newPassword, repeatPassword} = this

            if (prePassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (newPassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (repeatPassword == '') {
                this.$Notice.error({
                    title: '' + this.$t(Message.INPUT_EMPTY_ERROR)
                })
                return false
            }
            if (newPassword !== repeatPassword) {
                this.$Notice.error({
                    title: '' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR)
                })
                return false
            }
            return true
        }

        confirmUpdate() {
            if (!this.btnState || !this.checkInfo()) {
                return
            }
            const privateKey = decryptKey(this.getWallet, this.prePassword)
            this.checkPrivateKey(privateKey)
        }
        updatePW () {
            let encryptObj = encryptKey(this.privateKey, this.newPassword)
            let wallet = this.getWallet
            let walletList = this.$store.state.app.walletList;
            wallet.ciphertext = encryptObj['ciphertext']
            wallet.iv = encryptObj['iv']
            walletList[0] = wallet
            this.$store.commit('SET_WALLET', wallet)
            this.$store.commit('SET_WALLET_LIST', walletList)
            const account = saveLocalWallet(wallet, encryptObj, null, wallet.mnemonicEnCodeObj)
            this.$store.commit('SET_WALLET', account)
            this.init()
            this.$Notice.success({
                title: this.$t(Message.SUCCESS) + ''
            })
        }

        checkPrivateKey (DeTxt) {
            const that = this
            walletInterface.getWallet({
                name: this.getWallet.name,
                networkType: this.getWallet.networkType,
                privateKey: DeTxt.length === 64 ? DeTxt : ''
            }).then(async (Wallet: any) => {
                that.privateKey = DeTxt.toString().toUpperCase()
                that.updatePW()
            }).catch(() => {
                that.$Notice.error({
                    title: this.$t('password_error') + ''
                })
            })
        }

        init(){
            this.prePassword = ''
            this.newPassword = ''
            this.repeatPassword = ''
            this.privateKey = ''
        }
        created () {
            this.init()
        }
    }
</script>
<style scoped lang="less">
  @import "WalletUpdatePassword.less";
</style>
