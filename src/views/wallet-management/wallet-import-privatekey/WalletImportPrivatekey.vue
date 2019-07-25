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
          {{$t('set_password')}}
          <div class="tips">
            {{$t('This_password_is_a_private_key_password_and_will_be_used_when_you_pay')}}
          </div>
          <div class="gray_content">
            <input class="absolute" v-model="form.password" type="text" :placeholder="$t('please_set_your_password')">
          </div>
        </li>
        <li>
          {{$t('confirm_password')}}
          <div class="gray_content">
            <input class="absolute" v-model="form.checkPW" type="text"
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
    import {Account, NetworkType, Crypto} from "nem2-sdk"
    import {localRead, localSave} from '../../../utils/util'
    import {walletInterface} from "../../../interface/sdkWallet"
    // import "../wallet-import-privatekey/WalletImportPrivatekey.less"

    @Component
    export default class WalletImportPrivatekey extends Vue {
        form = {
            privateKey: '',
            password: '',
            checkPW: '',
        }
        account = {}

        importWallet() {
            this.checkImport()
            this.loginWallet(this.account)
        }

        checkImport() {
            if (!this.checkPrivateKey()) return
            if (!this.form.password || this.form.password == '') {
                this.$Message.error(this['$t']('Set_password_input_error'));
                return
            }
            if (this.form.password !== this.form.checkPW) {
                this.$Message.error(this['$t']('Two_passwords_are_inconsistent'));
                return
            }
        }

        checkPrivateKey() {
            try {
                if (!this.form.privateKey || this.form.privateKey === '') {
                    this.$Message.error('Mnemonic_input_error');
                    return false
                }
                const account = Account.createFromPrivateKey(this.form.privateKey, NetworkType.MIJIN_TEST)
                this.account = account
            } catch (e) {
                this.$Message.error(this['$t']('Mnemonic_input_error'));
            }

        }

        async loginWallet(account) {
            const that = this
            const walletName: any = 'wallet';
            const netType: NetworkType = account.address.networkType
            await that.setUserDefault(walletName, account, netType)
        }

        async setUserDefault(name, account, netType) {
            const that = this
            await walletInterface.getWallet({
                name: name,
                networkType: netType,
                privateKey: account.privateKey
            }).then((Wallet: any) => {
                const storeWallet = {
                    name: Wallet.result.wallet.name,
                    address: Wallet.result.wallet.address['address'],
                    networkType: Wallet.result.wallet.address['networkType'],
                    privateKey: Wallet.result.privateKey,
                    publicKey: account.publicKey,
                    publicAccount: account.publicAccount,
                    mosaics: [],
                    wallet: Wallet.result.wallet,
                    password: Wallet.result.password,
                    mnemonic: '',
                    balance: 0
                }
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = Crypto.encrypt(Wallet.result.privateKey, that.form['password'])
                that.localKey(name, encryptObj, Wallet.result.wallet.address.address, netType)
                this.toWalletDetails()
            })
        }

        localKey(walletName, keyObj, address, netType, balance = 0) {
            let localData: any[] = []
            let isExist: boolean = false
            try {
                localData = JSON.parse(localRead('wallets'))
            } catch (e) {
                localData = []
            }
            let saveData = {
                name: walletName,
                ciphertext: keyObj.ciphertext,
                iv: keyObj.iv,
                networkType: Number(netType),
                address: address,
                balance: balance
            }
            const account = this.$store.state.account.wallet;
            saveData = Object.assign(saveData, account)
            this.$store.commit('SET_WALLET', saveData)
            for (let i in localData) {
                if (localData[i].address === address) {
                    localData[i] = saveData
                    isExist = true
                }
            }
            if (!isExist) localData.unshift(saveData)
            localSave('wallets', JSON.stringify(localData))
        }

        toWalletDetails() {
            this.$Notice.success({
                title: this['$t']('Import_private_key_operation') + '',
                desc: this['$t']('Imported_wallet_successfully') + '',
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
@import "WalletImportPrivatekey.less";
</style>
