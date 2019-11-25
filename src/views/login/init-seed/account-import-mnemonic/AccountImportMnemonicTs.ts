import {Message, formDataConfig} from "@/config/index.ts"
import {mapState} from 'vuex'
import {NetworkType, Password} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {cloneData} from "@/core/utils"
import {AppInfo, StoreAccount, AppWallet, AppAccounts} from "@/core/model"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    components: {
        CheckPasswordDialog
    }
})
export class AccountImportMnemonicTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    form = cloneData(formDataConfig.walletImportMnemonicForm)
    showCheckPWDialog = false
    NetworkType = NetworkType

    get currentAccount() {
        return this.activeAccount.currentAccount
    }

    submit() {
        if (!this.checkImport()) return
        this.showCheckPWDialog = true
    }

    passwordValidated(password) {
        if (!password) return
        const {mnemonic} = this.form
        const seed = AppAccounts().encryptString(mnemonic, password)
        this.$store.commit('SET_MNEMONIC', seed)
        this.importWallet(password)
    }

    close() {
        this.showCheckPWDialog = false
    }

    checkImport() {
        const {walletName, mnemonic} = this.form

        if (!walletName || walletName == '') {
            this.$Notice.error({
                title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
            })
            return false
        }
        if (!mnemonic || this.form.mnemonic === '' || mnemonic.split(' ').length != 24) {
            this.$Notice.error({
                title: this.$t(Message.MNEMONIC_INPUT_ERROR) + ''
            })
            return false
        }
        return true
    }

    importWallet(password) {
        const {currentAccount} = this
        const {walletName, mnemonic} = this.form
        try {
            new AppWallet().createFromMnemonic(
                walletName,
                new Password(password),
                mnemonic,
                currentAccount.networkType,
                this.$store
            )

            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.$Notice.error({
                title: this.$t(Message.OPERATION_FAILED_ERROR) + ''
            })
        }
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$router.push('dashBoard')
    }

    toBack() {
        this.$router.back()
    }
}
