import {Message} from "@/config/index.ts"
import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils/hdWallet.ts"
import {networkTypeList} from "@/config/view";
@Component
export class WalletCreateTs extends Vue {
    formItem = {
        currentNetType: '',
        walletName: '',
        password: '',
        checkPW: '',
    }
    networkTypeList = networkTypeList

    checkInput() {
        if (!this.formItem.currentNetType || this.formItem.currentNetType == '') {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''})
            return false
        }
        if (!this.formItem.walletName || this.formItem.walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!this.formItem.password || this.formItem.password.length < 8) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        if (this.formItem.password !== this.formItem.checkPW) {
            this.$Notice.error({title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''})
            return false
        }
        return true
    }

    createWallet() {
        if (!this.checkInput()) return
        this.$store.commit('SET_MNEMONIC', createMnemonic())
        this.$emit('isCreated', this.formItem)
    }

    toBack() {
        this.$emit('closeCreate')
    }
}
