import {Message} from "@/config/index.ts"
import {Account, NetworkType} from "nem2-sdk"
import Wallet from 'ethereumjs-wallet'
import {Component, Vue} from 'vue-property-decorator'
import {encryptKey, getAccountDefault, saveLocalWallet} from "@/core/utils/wallet.ts"
import {
    passwordValidator,
    ALLOWED_SPECIAL_CHAR,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH
} from "@/core/utils/validation.ts"

@Component
export class WalletImportKeystoreTs extends Vue {
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    file = ''
    fileList = [{
        value: 'no data',
        label: 'no data'
    }]
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
    formItem = {
        walletName: 'wak',
        networkType: NetworkType.MIJIN_TEST,
        keystoreStr: '{"version":3,"id":"8f68aaa2-3f30-4cfd-b847-875e68a4697f","address":"a86a2bf1ae8942c4cbd3942322171352fae26abc","crypto":{"ciphertext":"5be1181a01f2a9a63de7afc66423c458e2b962d6b0986039d6269cb96ba6d56b","cipherparams":{"iv":"6ab5676a6df280be6c8872c62e7f058b"},"cipher":"aes-128-ctr","kdf":"scrypt","kdfparams":{"dklen":32,"salt":"1246dc705e65f13cc393e1e8842f182336d134c00f4934c3f87fbcda15f2627a","n":262144,"r":8,"p":1},"mac":"7bbf13c9e9d072664133eae4b5c6aa73af353c0ed9762d5a174785d3423e11d3"}}',
        walletPassword: '',
        walletPasswordAgain: '',
        keystorePassword: '1'
    }


    get getNode() {
        return this.$store.state.account.node
    }

    get currentXEM1() {
        return this.$store.state.account.currentXEM1
    }

    get currentXEM2() {
        return this.$store.state.account.currentXEM2
    }


    importWallet() {
        if (!this.checkForm()) return
        this.importWalletByKeystore()
    }

    async importWalletByKeystore() {
        const {keystoreStr, networkType, keystorePassword} = this.formItem
        const that = this
        try {
            let privatekey = Wallet.fromV3(keystoreStr.trim(), keystorePassword).getPrivateKeyString()
            privatekey = privatekey.substr(2, 64)
            const account = Account.createFromPrivateKey(privatekey, networkType)
            this.loginWallet(account)
        } catch (e) {
            this.$Notice.error({
                title: this.$t(Message.KEYSTORE_DECRYPTION_FAILED) + ''
            })
        }
    }

    loginWallet(account) {
        const {networkType, walletName, walletPassword} = this.formItem
        const that = this
        const netType: NetworkType = networkType;
        const walletList = this.$store.state.app.walletList
        const style = 'walletItem_bg_' + walletList.length % 3
        getAccountDefault(walletName, account, netType, this.getNode, this.currentXEM1, this.currentXEM2)
            .then((wallet) => {
                let storeWallet = wallet
                storeWallet['style'] = style
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = encryptKey(storeWallet['privateKey'], walletPassword)
                saveLocalWallet(storeWallet, encryptObj, null, {})
                this.toWalletDetails()
            })
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        });
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    checkForm() {
        const {keystoreStr, networkType, walletName, walletPassword, keystorePassword, walletPasswordAgain} = this.formItem
        if (networkType == 0) {
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''
            })
            return false
        }
        if (!walletName || walletName == '') {
            this.$Notice.error({
                title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
            })
            return false
        }

        if (!walletPassword) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
            })
            return false
        }
        if (walletPassword !== walletPasswordAgain) {
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    toBack() {
        this.$emit('closeImport')
    }
}
