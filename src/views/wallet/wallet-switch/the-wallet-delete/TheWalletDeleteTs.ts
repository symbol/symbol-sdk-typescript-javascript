import {Password} from 'nem2-sdk'
import {Message} from "@/config/index.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class TheWalletDeleteTs extends Vue {
    activeAccount: StoreAccount
    stepIndex = 0
    show = false
    confirmation = {
        value: ''
    }

    @Prop()
    showCheckPWDialog: boolean

    @Prop()
    walletToDelete: AppWallet


    get getWallet() {
        return this.activeAccount.wallet
    }

    get confirmationPrompt() {
        switch(this.getWallet.sourceType) {
            case 'Trezor':
                return 'please_confirm_your_wallet_name'
            default:
                return 'please_enter_your_wallet_password'
        }
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    deleteByPassword() {
        try {
            const password = new Password(this.confirmation.value)
            const isPasswordCorrect = new AppWallet(this.walletToDelete).checkPassword(password)
            if (isPasswordCorrect) {
                new AppWallet(this.walletToDelete).delete(this.$store, this)
                this.$emit('closeCheckPWDialog')
            } else {
                this.$Notice.error({
                    title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
                })
            }
        } catch (error) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    deleteByWalletNameConfirmation(){
        try {
            const isWalletNameCorrect = this.confirmation.value === this.getWallet.name
            if (isWalletNameCorrect) {
                new AppWallet(this.walletToDelete).delete(this.$store, this)
                this.$emit('closeCheckPWDialog')
            } else {
                this.$Notice.error({
                    title: this.$t(Message.WRONG_WALLET_NAME_ERROR) + ''
                })
            }
        } catch (error) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_WALLET_NAME_ERROR) + ''
            })
        }
    }

    submit() {
        // based on source of wallet, use different protection mechanisms
        switch(this.getWallet.sourceType) {
            case 'Trezor':
                return this.deleteByWalletNameConfirmation()
            default:
                return this.deleteByPassword()
        }
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.confirmation.value = '';

        this.show = this.showCheckPWDialog
    }
}
