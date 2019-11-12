import {Message, formDataConfig} from "@/config/index.ts"
import {mapState} from 'vuex'
import {NetworkType, Password} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {networkTypeConfig} from '@/config/view/setting'
import {cloneData, localRead} from "@/core/utils"
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

    get accountNetworkType() {
        return JSON.parse(localRead('accountMap'))[this.accountName].currentNetType
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    submit() {
        if (!this.checkImport()) return
        this.showCheckPWDialog = true
    }

    checkEnd(password) {
        if (!password) return
        const {mnemonic} = this.form
        const seed = AppAccounts().encryptString(mnemonic, password)
        this.$store.commit('SET_MNEMONIC', seed)
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkImport() {
        const {accountNetworkType} = this
        const {walletName,mnemonic} = this.form

        if (!walletName ||walletName == '') {
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

    // TODO USE ACCOUNT NETWORK TYPE
    importWallet(password) {
        const {accountNetworkType} = this
        const {walletName, mnemonic} = this.form
        try {
            new AppWallet().createFromMnemonic(
                walletName,
                new Password(password),
                mnemonic,
                accountNetworkType,
                this.$store
            )
            // TODO import 10 wallets or only used wallet
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
