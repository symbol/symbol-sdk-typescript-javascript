import {Message, networkTypeList, importKeystoreDefault} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {Password} from "nem2-sdk"
import {mapState} from 'vuex';
import {Component, Vue} from 'vue-property-decorator'
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
export class WalletImportKeystoreTs extends Vue {
    activeAccount: any
    app: any
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    file = ''
    fileList = []
    NetworkTypeList = networkTypeList
    formItem = importKeystoreDefault


    get getNode() {
        return this.activeAccount.node
    }

    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    get walletList() {
        return this.app.walletList
    }

    get currentXEM2() {
        return this.activeAccount.currentXEM2
    }

    submit() {
        if (!this.checkForm()) return
        this.importWallet()
    }

    importWallet() {
      try {
        new AppWallet().createFromKeystore(
          this.formItem.walletName,
          new Password(this.formItem.walletPassword),
          this.formItem.keystoreStr,
          this.formItem.networkType,
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
        this.$emit('toWalletDetails')
    }

    async checkForm() {
        const {keystoreStr, networkType, walletName, walletPassword, walletPasswordAgain} = this.formItem
        if (networkType == 0) {
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''
            })
            return false
        }
        if (!walletName || walletName == '') {
            this.$Notice.error({
                title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''
            })
            return false
        }
        if (!walletPassword || walletPassword.length < 6) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
            })
            return false
        }

        if (walletPassword != walletPasswordAgain) {
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    toBack() {
        this.$emit('closeImport')
    }
}
