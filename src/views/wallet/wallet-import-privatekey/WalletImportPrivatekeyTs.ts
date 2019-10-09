import {mapState} from 'vuex'
import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {Password, Account} from "nem2-sdk"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {formDataConfig} from '@/config/view/form'
import {networkTypeConfig} from '@/config/view/setting'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"

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
export class WalletImportPrivatekeyTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    account = {}
    form = formDataConfig.walletImportPrivateKeyForm
    networkType = networkTypeConfig
    showCheckPWDialog = false
    NetworkTypeList = networkTypeConfig

    submit() {
        if (!this.checkImport()) return
        this.showCheckPWDialog = true
    }

    checkEnd(password) {
        if (!password) return
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    importWallet(password) {
        const {walletName, privateKey, networkType} = this.form
        try {
            new AppWallet().createFromPrivateKey(
                walletName,
                new Password(password),
                privateKey,
                networkType,
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

    checkImport() {
        const {walletName} = this.form
        if (!walletName || walletName == '') {
            this.showNotice(this.$t(Message.WALLET_NAME_INPUT_ERROR))
            return false
        }
        return true
    }

    checkPrivateKey() {
        const {privateKey, networkType} = this.form

        if (!networkType) {
            this.showNotice(this.$t(Message.PLEASE_SWITCH_NETWORK))
            return false
        }

        if (!privateKey || privateKey === '') {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
        try {
            const account = Account.createFromPrivateKey(privateKey, networkType)
            this.account = account
            return true
        } catch (e) {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
    }

    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: text + ''
        })
    }

    // @VEEVALIDATE
    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Import_private_key_operation') + '',
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
        this.closeCheckPWDialog()
    }

    toBack() {
        this.$emit('closeImport')
    }
}
