import {Message} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {mapState} from 'vuex'
import {Password} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'
import {networkTypeList} from "@/config/view"
import {formData} from "@/config/formDto"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'
import {AppLock, createMnemonic} from "@/core/utils"

@Component({
    components: {
        CheckPasswordDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class AccountImportMnemonicTs extends Vue {
    activeAccount: any
    app: any
    form = formData.walletImportMnemonicForm
    NetworkTypeList = networkTypeList
    account = {}
    showCheckPWDialog = false

    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get walletList() {
        return this.app.walletList
    }

    submit() {
        if (!this.checkImport()) return
        this.showCheckPWDialog = true

    }

    checkEnd(password) {
        if (!password) return
        const {mnemonic} = this.form
        const seed = AppLock.encryptString(mnemonic, password)
        this.$store.commit('SET_MNEMONIC', seed)
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = true
    }

    checkImport() {
        if (this.form.networkType == 0) {
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''
            })
            return false
        }
        if (!this.form.walletName || this.form.walletName == '') {
            this.$Notice.error({
                title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
            })
            return false
        }
        if (!this.form.mnemonic || this.form.mnemonic === '' || this.form.mnemonic.split(' ').length != 12) {
            this.$Notice.error({
                title: this.$t(Message.MNENOMIC_INPUT_ERROR) + ''
            })
            return false
        }
        return true
    }

    importWallet(password) {
        const {walletName, mnemonic, networkType} = this.form
        try {
            new AppWallet().createFromMnemonic(
                walletName,
                new Password(password),
                mnemonic,
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

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$router.push('dashBoard')
    }

    toBack() {
        this.$router.push('initAccount')
    }
}
