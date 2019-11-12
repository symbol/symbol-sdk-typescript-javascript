import {mapState} from 'vuex'
import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {Password, Account, NetworkType} from "nem2-sdk"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {formDataConfig} from '@/config/view/form'
import {networkTypeConfig} from '@/config/view/setting'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {cloneData, localRead} from "@/core/utils"

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
    formItems = cloneData(formDataConfig.walletImportPrivateKeyForm)
    networkType = networkTypeConfig
    showCheckPWDialog = false
    NetworkTypeList = networkTypeConfig
    NetworkType = NetworkType

    get accountNetworkType() {
        return JSON.parse(localRead('accountMap'))[this.accountName].currentNetType
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    submit() {
        if (!this.checkPrivateKey()) return
        this.showCheckPWDialog = true
    }

    checkEnd(password) {
        if (!password) return
        this.closeCheckPWDialog()
        this.importWallet(password)
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
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
            this.toWalletDetails()
        } catch (error) {
            console.error(error)
            this.$Notice.error({
                title: this.$t(Message.OPERATION_FAILED_ERROR) + ''
            })
        }
    }


    checkPrivateKey() {
        const {privateKey} = this.formItems
        const {accountNetworkType} = this

        if (!privateKey || privateKey === '') {
            this.showNotice(this.$t(Message.PRIVATE_KEY_INVALID_ERROR))
            return false
        }
        try {
            const account = Account.createFromPrivateKey(privateKey, accountNetworkType)
            this.account = account
            return true
        } catch (e) {
            this.showNotice(this.$t(Message.PRIVATE_KEY_INVALID_ERROR))
            return false
        }
    }

    showNotice(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: text + ''
        })
    }

    // @VEE-VALIDATE
    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Import_private_key_operation') + '',
        })
        this.$emit('toWalletDetails')
    }

    initForm() {
        this.formItems = cloneData(formDataConfig.walletImportPrivateKeyForm)
    }
}
