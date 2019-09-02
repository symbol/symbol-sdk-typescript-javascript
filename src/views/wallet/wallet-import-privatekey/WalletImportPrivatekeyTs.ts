import {AppWallet} from '@/core/utils/wallet.ts'
import {mapState} from 'vuex';
import {Message, networkTypeList, formData} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {Password, Account} from "nem2-sdk"
import {
    ALLOWED_SPECIAL_CHAR,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH
} from "@/core/validation"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletImportPrivatekeyTs extends Vue {
    activeAccount: any
    app: any
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    account = {}
    form = formData.walletImportPrivateKeyForm
    networkType = networkTypeList
    
    NetworkTypeList = networkTypeList

    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }
    get walletList() {
        return this.app.walletList
    }

    importWallet() {
      try {
        new AppWallet().createFromPrivateKey(
          this.form.walletName,
          new Password(this.form.password),
          this.form.privateKey,
          this.form.networkType,
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
        const {walletName, password, privateKey, checkPW} = this.form
        if (!walletName || walletName == '') {
            this.showNotice(this.$t(Message.WALLET_NAME_INPUT_ERROR))
            return false
        }

        if (!password || password.length < 6 || password.length > 32) {
            this.showNotice(this.$t(Message.PASSWORD_SETTING_INPUT_ERROR))
            return false
        }
        if (password !== checkPW) {
            this.showNotice(this.$t(Message.INCONSISTENT_PASSWORD_ERROR))
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

    // @TODO: VeeValidate
    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Import_private_key_operation') + '',
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeImport')
    }
}
