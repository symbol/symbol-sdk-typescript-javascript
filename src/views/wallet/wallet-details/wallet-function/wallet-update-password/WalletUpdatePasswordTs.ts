import {Message} from "@/config/index"
import {Component, Vue} from 'vue-property-decorator'
import {walletApi} from "@/core/api/walletApi"
import {decryptKey, encryptKey, saveLocalWallet} from "@/core/utils/wallet";

@Component
export  class WalletUpdatePasswordTs extends Vue {
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
        this.checkPrivateKey(decryptKey(this.getWallet, this.prePassword))
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
        saveLocalWallet(wallet, encryptObj, null, wallet.mnemonicEnCodeObj)
        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    checkPrivateKey (DeTxt) {
        const that = this
        walletApi.getWallet({
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
