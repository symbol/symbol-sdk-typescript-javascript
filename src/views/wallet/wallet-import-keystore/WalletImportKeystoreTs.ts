import {Message, networkType} from "@/config/index.ts"
import {Account, NetworkType} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {
    decryptKeystore,
    getAccountDefault,
    encryptKey,
    decryptKey,
    saveLocalWallet
} from "@/core/utils/wallet.ts"
import {
    ALLOWED_SPECIAL_CHAR,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH
} from "@/core/validation"

@Component
export class WalletImportKeystoreTs extends Vue {
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    file = ''
    fileList = []
    NetworkTypeList = networkType
    formItem = {
        walletName: 'wak',
        networkType: NetworkType.MIJIN_TEST,
        keystoreStr: 'eyJuYW1lIjoiMzIxMzIxMzEyIiwiY2lwaGVydGV4dCI6eyJ3b3JkcyI6Wzg1NDY0MjkyNSwyMDMwOTQ2OTg5LC0xMTYzOTM0MCwxMjYzMTEzOTQyLDE1OTgyNzY0MjMsLTEzNDMwODUyMDgsLTEwMTM2MDI4NzAsMTIxNDI5ODg2LC0xNTkyNDUzNzg0LDE1OTU5OTEwMDYsLTEwMzkxMTQ1NjQsNzI4MjgxODc3XSwic2lnQnl0ZXMiOjQ4fSwiaXYiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOlsxODAsMTk2LDIyNywxNjYsMTc4LDIzNSw4OSwxNDUsMjI4LDY2LDExMiw2MSwyNCwyNSwzOCwxNjZdfSwibmV0d29ya1R5cGUiOjE0NCwiYWRkcmVzcyI6IlNBVUE1SlFSUDJGQk5QQU8zRlFJUlRKUlM1UEhKVjdDTFpTT1lMS0YiLCJwdWJsaWNLZXkiOiI2MjMyM0JDMkQwNzVDRDgxNUU0QTcxQjE4NzQ3MDhDOEVBQUVGRUMyOTVDNkYxQTgyRTZCOTE4MjJCQjJEREJCIiwibW5lbW9uaWNFbkNvZGVPYmoiOnt9fQ==',
        walletPassword: '111111',
        walletPasswordAgain: '111111',
        keystorePassword: '123'
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
        const {keystoreStr, networkType, keystorePassword, walletPassword} = this.formItem
        const that = this
        const wallet = JSON.parse(decryptKeystore(keystoreStr))
        const privatekey = decryptKey(wallet, keystorePassword) + ''
        if (!privatekey || privatekey.length !== 64) {
            this.$Notice.error({
                title: this.$t(Message.KEYSTORE_DECRYPTION_FAILED) + ''
            })
            return
        }
        const account = Account.createFromPrivateKey(privatekey, networkType)
        this.loginWallet(account)
    }

    loginWallet(account) {
        const {networkType, walletName, walletPassword} = this.formItem
        const that = this
        const netType: NetworkType = networkType
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
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    async checkForm() {
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
        if (!walletPassword || walletPassword.length < 6) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
            })
            return false
        }

        if (walletPassword != walletPasswordAgain) {
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
