
import {NetworkType} from "nem2-sdk"
import {localRead} from '@/core/utils/utils'
import {Message} from "@/config"
import {Component, Vue} from 'vue-property-decorator'
import {createMnemonic} from "@/core/utils/hdWallet";
import {
    passwordValidator,
    MIN_PASSWORD_LENGTH,
    MAX_PASSWORD_LENGTH,
    ALLOWED_SPECIAL_CHAR,
} from '@/core/utils/validation'
@Component
export class WalletCreateTs extends Vue {
    formItem = {
        currentNetType: '',
        walletName: '',
        password: '',
        checkPW: '',
    }
    passwordValidator = passwordValidator
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    netType = [
        {
            value: NetworkType.MIJIN_TEST,
            label: 'MIJIN_TEST'
        }, {
            value: NetworkType.MAIN_NET,
            label: 'MAIN_NET'
        }, {
            value: NetworkType.TEST_NET,
            label: 'TEST_NET'
        }, {
            value: NetworkType.MIJIN,
            label: 'MIJIN'
        },
    ]

    checkInput() {
        if (!this.formItem.currentNetType || this.formItem.currentNetType == '') {
            this.$Notice.error({title: this.$t(Message.PLEASE_SWITCH_NETWORK) + ''});
            return false
        }
        if (!this.formItem.walletName || this.formItem.walletName == '') {
            this.$Notice.error({title: this.$t(Message.WALLET_NAME_INPUT_ERROR) + ''});
            return false
        }
        if (!passwordValidator(this.formItem.password)) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''});
            return false
        }
        if (this.formItem.password !== this.formItem.checkPW) {
            this.$Notice.error({title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''});
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

    created() {
        const wallets = localRead('wallets')
        let list = wallets ? JSON.parse(wallets) : []
        if (list.length < 1) {
            this.$store.state.app.isInLoginPage = true
        }
    }
}
