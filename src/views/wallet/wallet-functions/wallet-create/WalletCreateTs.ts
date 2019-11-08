import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {NetworkType, Password} from "nem2-sdk"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import {AppWallet, StoreAccount} from '@/core/model'
import {mapState} from "vuex"
import {createSubWalletByPathNumber} from "@/core/utils"
import {networkConfig} from '@/config/index.ts'
import {networkTypeConfig} from '@/config/view/setting'

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
    formItem = {
        currentNetType: NetworkType.MIJIN_TEST,
        walletName: 'wallet-create',
        path: 0
    }
    networkTypeList = networkTypeConfig

    showCheckPWDialog = false


    get accountName() {
        return this.activeAccount.accountName
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    checkEnd(password) {
        if (!password) return
        const {currentNetType, walletName, path} = this.formItem
        try {
            new AppWallet().createFromPath(walletName, new Password(password), path, currentNetType, this.$store)
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
        const {currentNetType, walletName, path} = this.formItem
        if (!currentNetType) {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''})
            return false
        }
        if (!walletName || walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!path) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        try {
            createSubWalletByPathNumber(networkConfig.testMnemonicString, path)
            return true
        } catch (e) {
            this.$Notice.error({title: this.$t(Message.HD_WALLET_PATH_ERROR) + ''})
            return false
        }

    }

    toBack() {
        this.$emit('closeCreate')
    }
}
