import {Message} from "@/config/index.ts"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppAccounts, AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({activeAccount: 'account', app: 'app'})
    }
})
export class TheWalletDeleteTs extends Vue {
    activeAccount: StoreAccount
    app: any
    password:string=''

    @Prop()
    showCheckPWDialog: boolean

    @Prop()
    walletToDelete: AppWallet

    get visible(){
        return this.showCheckPWDialog
    }

    set visible(value){
        this.$emit('closeCheckPWDialog')
    }

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

    deleteByPassword() {
        if(this.walletList.length == 1) {
           AppAccounts().deleteAccount(this.activeAccount.currentAccount.name)
            this.accountQuit()
            return
        }
        try {
            const isPasswordCorrect = AppWallet.createFromDTO(this.walletToDelete).checkPassword(this.password)
            if (isPasswordCorrect) {
                AppWallet.createFromDTO(this.walletToDelete).delete(this.$store, this)
                this.visible = false
                return
            }
              this.$Notice.error({
                  title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
              })

        } catch (error) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    deleteByWalletNameConfirmation() {
        try {
            const isWalletNameCorrect = this.password === this.getWallet.name
            if (isWalletNameCorrect) {
                AppWallet.createFromDTO(this.walletToDelete).delete(this.$store, this)
              this.visible = false
              return
            }
                this.$Notice.error({
                    title: this.$t(Message.WRONG_WALLET_NAME_ERROR) + ''
                })

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

}
