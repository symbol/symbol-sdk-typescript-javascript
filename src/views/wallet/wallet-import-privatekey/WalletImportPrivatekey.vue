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
    import {Message} from "@/config/index"
    import {localRead, localSave} from '@/help/help'
    import {Component, Vue} from 'vue-property-decorator'
    import {Account, NetworkType, Crypto} from "nem2-sdk"
    import {walletInterface} from "@/interface/sdkWallet"
    import {accountInterface} from "@/interface/sdkAccount"

    @Component
    export default class WalletImportPrivatekey extends Vue {
        account = {}
        form = {
            privateKey: 'FB628AF4276F696AD1FA85B7AB1E49CFD896E5EC85000E3179EEEA59717DD8DE',
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

        importWallet() {
            if (!this.checkPrivateKey()) return
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

        checkPrivateKey() {
            try {
                if (!this.form.privateKey || this.form.privateKey === '') {
                    this.$Notice.error({
                        title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
                    })
                    return false
                }
                const account = Account.createFromPrivateKey(this.form.privateKey, NetworkType.MIJIN_TEST)
                this.account = account
                return true
            } catch (e) {
                this.$Notice.error({
                    title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
                })
                return false
            }
        }

        async loginWallet(account) {
            const that = this
            const walletName: any = this.form.walletName;
            const netType: NetworkType = this.form.networkType;
            await that.setUserDefault(walletName, account, netType)
        }

        setUserDefault(name, account, netType) {
            const that = this
            const walletList = this.$store.state.app.walletList
            const style = 'walletItem_bg_' + walletList.length % 3
            walletInterface.getWallet({
                name: name,
                networkType: netType,
                privateKey: account.privateKey
            }).then(async (Wallet: any) => {
                let storeWallet = {
                    name: Wallet.result.wallet.name,
                    address: Wallet.result.wallet.address['address'],
                    networkType: Wallet.result.wallet.address['networkType'],
                    privateKey: Wallet.result.privateKey,
                    publicKey: account.publicKey,
                    publicAccount: account.publicAccount,
                    mosaics: [],
                    wallet: Wallet.result.wallet,
                    password: Wallet.result.password,
                    balance: 0,
                    style
                }
                await that.getMosaicList(storeWallet).then((data) => {
                    storeWallet = data
                })
                await that.getMultisigAccount(storeWallet).then((data) => {
                    storeWallet = data
                })
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = Crypto.encrypt(Wallet.result.privateKey, that.form['password'])
                that.localKey(storeWallet, encryptObj, {})
                this.toWalletDetails()
            })
        }

        async getMosaicList(listItem) {
            let walletItem = listItem
            let node = this.$store.state.account.node
            let currentXEM2 = this.$store.state.account.currentXEM2
            let currentXEM1 = this.$store.state.account.currentXEM1
            await accountInterface.getAccountInfo({
                node,
                address: walletItem.address
            }).then(async accountInfoResult => {
                await accountInfoResult.result.accountInfo.subscribe((accountInfo) => {
                    let mosaicList = accountInfo.mosaics
                    mosaicList.map((item) => {
                        item.hex = item.id.toHex()
                        if (item.id.toHex() == currentXEM2 || item.id.toHex() == currentXEM1) {
                            walletItem.balance = item.amount.compact() / 1000000
                        }
                    })
                    walletItem.mosaics = mosaicList
                }, () => {
                    walletItem.balance = 0
                })
            })
            return walletItem
        }

        async getMultisigAccount(listItem) {
            let walletItem = listItem
            let node = this.$store.state.account.node
            await accountInterface.getMultisigAccountInfo({
                node: node,
                address: walletItem.address
            }).then((multisigAccountInfo) => {
                if (typeof (multisigAccountInfo.result.multisigAccountInfo) == 'object') {
                    multisigAccountInfo.result.multisigAccountInfo['subscribe']((accountInfo) => {
                        walletItem.isMultisig = true
                    }, () => {
                        walletItem.isMultisig = false
                    })
                }
            })
            return walletItem
        }

        localKey(wallet, keyObj, mnemonicEnCodeObj) {
            let localData: any[] = []
            let isExist: boolean = false
            try {
                localData = JSON.parse(localRead('wallets'))
            } catch (e) {
                localData = []
            }
            let saveData = {
                name: wallet.name,
                ciphertext: keyObj.ciphertext,
                iv: keyObj.iv,
                networkType: wallet.networkType,
                address: wallet.address,
                publicKey: wallet.publicKey,
                mnemonicEnCodeObj: mnemonicEnCodeObj
            }
            let account = this.$store.state.account.wallet;
            account = Object.assign(account, saveData)
            this.$store.commit('SET_WALLET', account)
            for (let i in localData) {
                if (localData[i].address === wallet.address) {
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
