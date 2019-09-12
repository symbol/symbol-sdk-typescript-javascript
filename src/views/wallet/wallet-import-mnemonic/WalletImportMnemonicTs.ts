import {Message, networkTypeList, formData} from "@/config/index.ts"
import {AppWallet} from '@/core/utils/wallet.ts'
import {mapState} from 'vuex';
import {Password} from "nem2-sdk"
import {Component, Vue} from 'vue-property-decorator'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletImportMnemonicTs extends Vue {
    activeAccount: any
    app: any
    form = formData.walletImportMnemonicForm
    NetworkTypeList = networkTypeList
    account = {}

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

    submit() {
        if (!this.checkImport()) return
        this.importWallet()
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
        if (!this.form.password || this.form.password.length < 8) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
            })
            return false
        }
        if (this.form.password !== this.form.checkPW) {
            this.$Notice.error({
                title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''
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

    importWallet() {
      try {
        new AppWallet().createFromMnemonic(
          this.form.walletName,
          new Password(this.form.password),
          this.form.mnemonic,
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

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Imported_wallet_successfully') + ''
        })
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeImport')
    }
}
