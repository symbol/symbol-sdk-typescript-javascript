import {Component, Vue, Provide} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {Password, NetworkType} from "nem2-sdk"
import {formDataConfig, Message} from "@/config/index.ts"
import {networkTypeConfig} from '@/config/view/setting'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {cloneData, localRead} from "@/core/utils"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    components: {CheckPasswordDialog, ErrorTooltip}
})
export class WalletImportKeystoreTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    NetworkType = NetworkType
    file = ''
    fileList = []
    NetworkTypeList = networkTypeConfig
    formItem = cloneData(formDataConfig.importKeystoreConfig)
    showCheckPWDialog = false

    get accountNetworkType() {
        return JSON.parse(localRead('accountMap'))[this.accountName].networkType
    }

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    passwordValidated(password) {
        if (!password) return
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.showCheckPWDialog = true
            })
    }

    importWallet(password) {
        const {accountNetworkType} = this
        const {keystorePassword, keystoreStr} = this.formItem
        try {
            new AppWallet().createFromKeystore(
                this.formItem.walletName,
                new Password(password),
                new Password(keystorePassword),
                keystoreStr,
                accountNetworkType,
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

    showErrorNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
        })
    }

    initData() {
        this.formItem = cloneData(formDataConfig.importKeystoreConfig)
    }
}
