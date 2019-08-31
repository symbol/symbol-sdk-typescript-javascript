import {Message} from "@/config/index.ts"
import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {decryptKey, encryptKey, saveLocalWallet} from "@/core/utils/wallet.ts"

@Component
export class WalletUpdatePasswordTs extends Vue {
    formItem = {
        prePassword: '',
        newPassword: '',
        repeatPassword: '',
    }
    privateKey = ''
    isCompleteForm = false

    get getWallet() {
        return this.$store.state.account.wallet
    }

    checkInfo() {
        const {prePassword, newPassword, repeatPassword} = this.formItem

        if (prePassword == '' || newPassword == '' || repeatPassword == '') {
            this.showNotice('' + this.$t(Message.INPUT_EMPTY_ERROR))
            return false
        }

        if (newPassword !== repeatPassword) {
            this.showNotice('' + this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
            return false
        }
        return true
    }


    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: '' + text
        })
    }

    confirmUpdate() {
        if (!this.isCompleteForm) return
        if (!this.checkInfo()) return
        this.checkPrivateKey(decryptKey(this.getWallet, this.formItem.prePassword))
    }

    updatePW() {
        let encryptObj = encryptKey(this.privateKey, this.formItem.newPassword)
        let wallet = this.getWallet
        let walletList = this.$store.state.app.walletList
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

    checkPrivateKey(DeTxt) {
        const that = this
        try {
            new WalletApiRxjs().getWallet(
                that.getWallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                that.getWallet.networkType,
            )
            that.privateKey = DeTxt.toString().toUpperCase()
            that.updatePW()
        } catch (e) {
            that.showNotice('' + this.$t(Message.WRONG_PASSWORD_ERROR))
        }
    }

    init() {
        this.formItem.prePassword = ''
        this.formItem.newPassword = ''
        this.formItem.repeatPassword = ''
        this.privateKey = ''
    }

    @Watch('formItem', {immediate: true, deep: true})
    onFormItemChange() {
        const {prePassword, newPassword, repeatPassword} = this.formItem
        // isCompleteForm
        this.isCompleteForm = prePassword !== '' && newPassword !== '' && repeatPassword !== ''
    }

    created() {
        this.init()
    }
}
