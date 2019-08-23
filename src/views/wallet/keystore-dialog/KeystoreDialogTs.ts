import Wallet from 'ethereumjs-wallet'
import {Message} from "@/config/index.ts"
import {decryptKey} from "@/core/utils/wallet.ts"
import {copyTxt} from "@/core/utils/utils.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export class KeystoreDialogTs extends Vue {
    isGenerationKeystore = false
    stepIndex = 0
    show = false
    QRCode = ''
    keystoreText = ''
    wallet = {
        password: '',
        keystorePassword: '',
        keystorePasswordAgain: ''
    }

    @Prop()
    showKeystoreDialog: boolean


    get getWallet() {
        return this.$store.state.account.wallet
    }

    saveQRCode() {

    }

    keystoreDialogCancel() {
        this.$emit('closeKeystoreDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportKeystore() {
        switch (this.stepIndex) {
            case 0 :
                this.checkWalletPassword()
                break;
            case 1 :
                this.generateKeystore()
                break;
            case 2 :
                this.stepIndex = 3
                break;
            case 3 :
                this.stepIndex = 4
                break;
        }
    }

    async generateKeystore() {
        if (!this.checkKeystorePassword()) return
        const {keystorePassword} = this.wallet
        const privatekey = decryptKey(this.getWallet, this.wallet.password) + ''
        let key = Buffer.from(privatekey, 'hex')
        const wallet = await Wallet.fromPrivateKey(key);
        this.keystoreText = await wallet.toV3String(keystorePassword)
        this.isGenerationKeystore = false
        this.stepIndex = 2
    }

    checkKeystorePassword() {
        const {keystorePassword, keystorePasswordAgain} = this.wallet
        if (keystorePassword !== keystorePasswordAgain) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
            })
            return false
        }

        return true

    }

    checkWalletPassword() {
        if (!this.checkInput()) return
        this.stepIndex = 1
    }

    checkInput() {
        const {password} = this.wallet
        if (!password || password == '') {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SET_WALLET_PASSWORD_INFO) + ''
            })
            return false
        }
        const privatekey = decryptKey(this.getWallet, this.wallet.password) + ''
        if (privatekey.length !== 64) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    toPrevPage() {
        this.stepIndex = 2
    }

    copyKeystore() {
        copyTxt(this.keystoreText).then((data) => {
            this.$Notice.success({
                title: this.$t(Message.COPY_SUCCESS) + ''
            });
        })
    }


    @Watch('showKeystoreDialog')
    onShowKeystoreDialogChange() {
        this.show = this.showKeystoreDialog
    }
}
