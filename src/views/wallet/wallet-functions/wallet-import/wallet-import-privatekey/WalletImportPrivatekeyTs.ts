import {mapState} from 'vuex'
import {NetworkType, Password} from "nem2-sdk"
import {Component, Provide, Vue} from 'vue-property-decorator'
import {AppInfo, AppWallet, StoreAccount} from "@/core/model"
import {Message, formDataConfig, networkTypeConfig} from "@/config"
import {cloneData} from "@/core/utils"
import {validation} from '@/core/validation'
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
export class WalletImportPrivatekeyTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    NetworkTypeList = networkTypeConfig
    NetworkType = NetworkType
    validation = validation
    account = {}
    formItems = cloneData(formDataConfig.walletImportPrivateKeyForm)
    networkType = networkTypeConfig
    showCheckPWDialog = false

    get currentAccount() {
        return this.activeAccount.currentAccount
    }

    get accountNetworkType() {
        return this.currentAccount.networkType
    }

    submit() {
        this.$validator
        .validate()
        .then((valid) => {
            if (!valid) return
            this.showCheckPWDialog = true
        })
    }

    passwordValidated(password) {
        if (!password) return
        this.importWallet(password)
    }

    importWallet(password) {
        const {accountNetworkType} = this
        const {walletName, privateKey} = this.formItems
        try {
            new AppWallet().createFromPrivateKey(
                walletName,
                new Password(password),
                privateKey,
                accountNetworkType,
                this.$store
            )
            this.$Notice.success({
                title: this['$t']('Import_private_key_operation') + '',
            })
            this.$emit('toWalletDetails')
        } catch (error) {
            console.error(error)
            this.$Notice.error({
                title: this.$t(Message.OPERATION_FAILED_ERROR) + ''
            })
        }
    }

    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: text + ''
        })
    }

    initForm() {
        this.formItems = cloneData(formDataConfig.walletImportPrivateKeyForm)
    }
}
