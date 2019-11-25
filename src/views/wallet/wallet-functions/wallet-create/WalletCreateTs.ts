import {formDataConfig, Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {NetworkType, Password} from "nem2-sdk"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {AppWallet, StoreAccount} from '@/core/model'
import {mapState} from "vuex"
import {createMnemonic, getAccountFromPathNumber, localRead} from "@/core/utils"

@Component({
    components: {
        CheckPasswordDialog
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class WalletCreateTs extends Vue {
    activeAccount: StoreAccount
    formItem = formDataConfig.walletCreateForm
    showCheckPWDialog = false
    NetworkType = NetworkType

    get accountNetworkType (){
        return JSON.parse(localRead('accountMap'))[this.accountName].networkType
    }

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    passwordValidated(password) {
        if (!password) return
        const {accountNetworkType} = this
        const {walletName, path} = this.formItem
        try {
            new AppWallet().createFromPath(walletName, new Password(password), path, accountNetworkType, this.$store)
            this.$router.push('dashBoard')
        } catch (e) {
            this.$Notice.error({title: this.$t(Message.HD_WALLET_PATH_ERROR) + ''})
        }
    }

    submit() {
        if (!this.checkInput()) return
        this.showCheckPWDialog = true
    }

    checkInput() {
        const {walletName, path} = this.formItem

        if (!walletName || walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!path) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        try {
            getAccountFromPathNumber(createMnemonic(), path, this.accountNetworkType)
            return true
        } catch (e) {
            this.$Notice.error({title: this.$t(Message.HD_WALLET_PATH_ERROR) + ''})
            console.log(e)
            return false
        }
    }
}
