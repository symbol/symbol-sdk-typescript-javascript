import {Message} from "@/config/index.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {copyTxt, localRead} from "@/core/utils/utils.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Password} from "nem2-sdk"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class KeystoreDialogTs extends Vue {
    activeAccount: any
    stepIndex = 0
    show = false
    QRCode = ''
    keystoreText = ''
    wallet = {
        password: ''
    }

    @Prop()
    showKeystoreDialog: boolean


    get getWallet() {
        return this.activeAccount.wallet
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

    // @TODO: VeeValidate
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

        const validPassword = new AppWallet(this.getWallet).checkPassword(new Password(this.wallet.password))

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


    @Watch('showKeystoreDialog')
    onShowKeystoreDialogChange() {
        this.show = this.showKeystoreDialog
    }
}
