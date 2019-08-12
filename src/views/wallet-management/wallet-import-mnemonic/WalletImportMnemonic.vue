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
    import {Component, Vue} from 'vue-property-decorator'
    import {NetworkType, Crypto} from "nem2-sdk"
    import {localRead, localSave} from '../../../utils/util'
    import {strToHexCharCode} from '../../../utils/tools'
    import Message from "@/message/Message";
    import {createAccount} from "../../../help/mnemonicUtil";
    import {getAccountDefault, saveLocalWallet} from "../../../help/appUtil";


    @Component
    export default class WalletImportMnemonic extends Vue {
        form = {
            mnemonic: '',
            networkType: 0,
            walletName: '',
            password: '',
            checkPW: '',
        }
        NetworkTypeList = [
            {
                value: NetworkType.MIJIN_TEST,
                label: 'MIJIN_TEST'
            }, {
                value: NetworkType.MAIN_NET,
                label: 'MAIN_NET'
            }, {
                value: NetworkType.TEST_NET,
                label: 'TEST_NET'
            }, {
                value: NetworkType.MIJIN,
                label: 'MIJIN'
            },
        ]
        account = {}

        get node () {
            return this.$store.state.account.node
        }

        get currentXEM1() {
            return this.$store.state.account.currentXEM1
        }

        get currentXEM2() {
            return this.$store.state.account.currentXEM2
        }

        importWallet() {
            if (!this.checkMnemonic()) return
            if (!this.checkImport()) return
            this.loginWallet(this.account)
        }

        checkImport() {
            if (this.form.networkType == 0) {
                this.$Notice.error({
                    title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''
                })
                return false
            }
            if (!this.form.walletName || this.form.walletName == '') {
                this.$Notice.error({
                    title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
                })
                return false
            }
            if (!this.form.password || this.form.password == '') {
                this.$Notice.error({
                    title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
                })
                return false
            }
            if (this.form.password !== this.form.checkPW) {
                this.$Notice.error({
                    title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
                })
                return false
            }
            return true
        }

        checkMnemonic() {
            try {
                if (!this.form.mnemonic || this.form.mnemonic === '' || this.form.mnemonic.split(' ').length != 12) {
                    this.$Notice.error({
                        title: this.$t(Message.MNENOMIC_INPUT_ERROR) + ''
                    })
                    return false
                }
                const account = createAccount(this.form.mnemonic)
                this.$store.commit('SET_ACCOUNT', account);
                this.account = account
                return true
            } catch (e) {
                this.$Notice.error({
                    title: this.$t(Message.MNENOMIC_INPUT_ERROR) + ''
                })
                return false
            }

        }

        loginWallet(account) {
            const that = this
            const walletName: any = this.form.walletName;
            const netType: NetworkType = this.form.networkType;
            that.setDefaultWallet(walletName, account, netType)
        }

        async setDefaultWallet(name, account, netType) {
            const walletList = this.$store.state.app.walletList
            const style = 'walletItem_bg_' + walletList.length % 3
            const storeWallet = await getAccountDefault(name, account, netType, this.node,this.currentXEM1, this.currentXEM2)
            storeWallet['style'] = style
            const encryptObj = Crypto.encrypt(storeWallet['privateKey'], this.form['password'])
            const mnemonicEnCodeObj = Crypto.encrypt(strToHexCharCode(this.form.mnemonic), this.form['password'])
            const wallet = saveLocalWallet(storeWallet, encryptObj, null, mnemonicEnCodeObj)
            this.$store.commit('SET_WALLET', wallet)
            this.toWalletDetails()
        }

        toWalletDetails() {
            this.$Notice.success({
                title: this['$t']('Imported_wallet_successfully') + ''
            });
            this.$store.commit('SET_HAS_WALLET', true)
            this.$emit('toWalletDetails')
        }

        toBack() {
            this.$emit('closeImport')
        }
    }
</script>
<style scoped lang="less">
  @import "WalletImportMnemonic";
</style>
