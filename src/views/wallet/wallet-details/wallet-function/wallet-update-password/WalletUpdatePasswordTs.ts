import {Crypto} from 'nem2-sdk'
import {Message} from "@/config/index"
import {localRead, localSave} from '@/help/help'
import {Component, Vue} from 'vue-property-decorator'
import {walletInterface} from "@/interface/sdkWallet"

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
        this.decryptKey()
    }
    updatePW () {
        let encryptObj = this.encryptKey()
        let wallet = this.getWallet
        let walletList = this.$store.state.app.walletList;
        wallet.ciphertext = encryptObj['ciphertext']
        wallet.iv = encryptObj['iv']
        walletList[0] = wallet
        this.$store.commit('SET_WALLET', wallet)
        this.$store.commit('SET_WALLET_LIST', walletList)
        this.localKey(wallet, encryptObj, wallet.mnemonicEnCodeObj)
        this.init()
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }

    encryptKey () {
        return Crypto.encrypt(this.privateKey, this.newPassword)
    }
    decryptKey () {
        let encryptObj = {
            ciphertext: this.getWallet.ciphertext,
            iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
            key: this.prePassword
        }
        this.checkPrivateKey(Crypto.decrypt(encryptObj))
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
        for (let i in localData) {
            if (localData[i].address === wallet.address) {
                localData[i] = saveData
                isExist = true
            }
        }
        if (!isExist) localData.unshift(saveData)
        localSave('wallets', JSON.stringify(localData))
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
