import {Message} from "@/config/index.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppAccounts, AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({activeAccount: 'account', app: 'app'})
    }
})
export class TheWalletDeleteTs extends Vue {
    activeAccount: StoreAccount
    stepIndex = 0
    show = false
    app: any
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
        switch (this.getWallet.sourceType) {
            case 'Trezor':
                return 'please_confirm_your_wallet_name'
            default:
                return 'please_enter_your_wallet_password'
        }
    }

    get walletList() {
        return this.app.walletList
    }

    accountQuit() {
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_ACCOUNT')
        this.$router.push({
            name: "login"
        })
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    deleteByPassword() {
        if(this.walletList.length == 1) {
           AppAccounts().deleteAccount(this.activeAccount.currentAccount.name)
            this.accountQuit()
            return
        }
        try {
            const isPasswordCorrect = new AppWallet(this.walletToDelete).checkPassword(this.confirmation.value)
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

    deleteByWalletNameConfirmation() {
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
        switch (this.getWallet.sourceType) {
            case 'Trezor':
                return this.deleteByWalletNameConfirmation()
            default:
                return this.deleteByPassword()
        }
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.confirmation.value = ''
        this.show = this.showCheckPWDialog
    }
}
