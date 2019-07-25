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
    import {MnemonicPassPhrase, ExtendedKey, Wallet} from 'nem2-hd-wallets'
    import {NetworkType, Account, Crypto} from "nem2-sdk"
    import {localRead, localSave} from '../../../utils/util'
    import {walletInterface} from "../../../interface/sdkWallet"


    @Component
    export default class WalletImportMnemonic extends Vue {
        form = {
            mnemonic: '',
            password: '',
            checkPW: '',
        }
        account = {}

        importWallet() {
            !this.checkImport()
            this.loginWallet(this.account)
        }

        checkImport() {
            if (!this.checkMnemonic()) return
            if (!this.form.password || this.form.password == '') {
                this.$Message.error(this.$t('Set_password_input_error'));
                return
            }
            if (this.form.password !== this.form.checkPW) {
                this.$Message.error(this.$t('Two_passwords_are_inconsistent'))
                return
            }
        }

        checkMnemonic() {
            try {
                if (!this.form.mnemonic || this.form.mnemonic === '') {
                    this.$Message.error(this.$t('Mnemonic_input_error'));
                    return false
                }
                const account = this.createAccount(this.form.mnemonic)
                this.$store.commit('SET_ACCOUNT', account);
                this.account = account
            } catch (e) {
                this.$Message.error(this.$t('Mnemonic_input_error'));
            }

        }

        createAccount(mnemonic) {
            const PassPhrase = new MnemonicPassPhrase(mnemonic);
            const bip32Seed = PassPhrase.toSeed();
            const bip32Node = ExtendedKey.createFromSeed(this.buf2hex(bip32Seed));
            const wallet = new Wallet(bip32Node);
            const account = wallet.getAccount();
            return account
        }

        buf2hex(buffer) {
            // buffer is an ArrayBuffer
            // create a byte array (Uint8Array) that we can use to read the array buffer
            const byteArray = new Uint8Array(buffer);

            // for each element, we want to get its two-digit hexadecimal representation
            const hexParts = [];
            for (let i = 0; i < byteArray.length; i++) {
                // convert value to hexadecimal
                const hex = byteArray[i].toString(16);

                // pad with zeros to length 2
                const paddedHex = ('00' + hex).slice(-2);

                // push to array
                hexParts.push(paddedHex);
            }

            // join all the hex values of the elements into a single string
            return hexParts.join('');
        }

        loginWallet(account) {
            const that = this
            const walletName: any = 'wallet';
            const netType: NetworkType = account.address.networkType
            that.setUserDefault(walletName, account, netType)
        }

        setUserDefault(name, account, netType) {
            const that = this
            walletInterface.getWallet({
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
                    mnemonic: this.form.mnemonic,
                    balance: 0
                }
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = Crypto.encrypt(Wallet.result.privateKey, that.form['password'])
                that.localKey(name, encryptObj, Wallet.result.wallet.address.address,netType)
                this.toWalletDetails()
            })
        }

        localKey (walletName, keyObj, address, netType, balance = 0) {
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

        toWalletDetails () {
            this.$Notice.success({
                title: '' + this['$t']('Import_mnemonic_operations'),
                desc: this['$t']('Imported_wallet_successfully') + ''
            });
            this.$store.commit('SET_HAS_WALLET',true)
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
