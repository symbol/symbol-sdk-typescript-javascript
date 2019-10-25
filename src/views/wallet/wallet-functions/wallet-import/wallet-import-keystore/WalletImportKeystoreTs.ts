import {formDataConfig, Message} from "@/config/index.ts"
import {Password, NetworkType} from "nem2-sdk"
import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {networkTypeConfig} from '@/config/view/setting'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {cloneData} from "@/core/utils"

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
export class WalletImportKeystoreTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    file = ''
    fileList = []
    NetworkTypeList = networkTypeConfig
    formItem = cloneData(formDataConfig.importKeystoreConfig)
    showCheckPWDialog = false

    checkEnd(password) {
        if (!password) return
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    submit() {
        if (!this.checkForm()) return
        this.showCheckPWDialog = true
    }

    importWallet(password) {
        const {keystorePassword, networkType, keystoreStr} = this.formItem
        try {
            new AppWallet().createFromKeystore(
                this.formItem.walletName,
                new Password(password),
                new Password(keystorePassword),
                keystoreStr,
                networkType,
                this.$store
            )
            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.showErrorNotice(Message.OPERATION_FAILED_ERROR)
        }
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.closeCheckPWDialog()
        this.$emit('toWalletDetails')
    }

    checkForm() {
        const {networkType, walletName, keystorePassword, keystoreStr} = this.formItem
        if (!(networkType in NetworkType)) {
            this.showErrorNotice(Message.PLEASE_SWITCH_NETWORK)
            return false
        }
        if (!walletName || walletName == '') {
            this.showErrorNotice(Message.WALLET_NAME_INPUT_ERROR)
            return false
        }
        if (!keystorePassword || keystorePassword == '') {
            this.showErrorNotice(Message.INPUT_EMPTY_ERROR)
            return false
        }

        if (!keystoreStr || keystoreStr == '') {
            this.showErrorNotice(Message.INPUT_EMPTY_ERROR)
            return false
        }
        return true
    }

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
        })
    }

    initData() {
        this.formItem = cloneData(formDataConfig.importKeystoreConfig)
    }

    toBack() {
        this.initData()
        this.$emit('closeImport')
    }
}
