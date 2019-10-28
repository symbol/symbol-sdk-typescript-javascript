import {Message} from "@/config/index.ts"
import {copyTxt} from "@/core/utils"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Password} from "nem2-sdk"
import {AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class KeystoreDialogTs extends Vue {
    activeAccount: StoreAccount
    stepIndex = 0
    QRCode = ''
    keystoreText = ''
    wallet = {
        password: ''
    }

    @Prop()
    showKeystoreDialog: boolean

    get show() {
        return this.showKeystoreDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    saveQRCode() {

    }

    keystoreDialogCancel() {
        this.wallet.password = ''
        this.$emit('closeKeystoreDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportKeystore() {
        switch (this.stepIndex) {
            case 0 :
                this.checkWalletPassword()
                break
            case 1 :
                this.generateKeystore()
                break
            case 2 :
                this.stepIndex = 3
                break
        }
    }

    async generateKeystore() {
        this.keystoreText = new AppWallet(this.getWallet).getKeystore()
        this.stepIndex = 2
    }

    // @VEEVALIDATE
    checkWalletPassword() {
        if (!this.checkInput()) return
        this.stepIndex = 1
    }

    checkInput() {
        if (!this.wallet.password || this.wallet.password == '') {
            this.$Notice.error({
                title: this.$t('please_set_your_wallet_password') + ''
            })
            return false
        }

        if (this.wallet.password.length < 8) {
            this.$Notice.error({
                title: this.$t('password_error') + ''
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(this.wallet.password)

        if (!validPassword) {
            this.$Notice.error({
                title: this.$t('password_error') + ''
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
            })
        }).catch((error) => {
            console.log(error)
        })
    }
}
