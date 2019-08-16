import {Message} from "@/config"
import {Component, Vue} from 'vue-property-decorator'
import {Account, NetworkType} from "nem2-sdk"
import {encryptKey, getAccountDefault, saveLocalWallet} from "@/core/utils/wallet";
import {
    ALLOWED_SPECIAL_CHAR,
    MAX_PASSWORD_LENGTH,
    MIN_PASSWORD_LENGTH,
    passwordValidator
} from "@/core/utils/validation";

@Component
export class WalletImportPrivatekeyTs extends Vue {
    MIN_PASSWORD_LENGTH = MIN_PASSWORD_LENGTH
    MAX_PASSWORD_LENGTH = MAX_PASSWORD_LENGTH
    ALLOWED_SPECIAL_CHAR = ALLOWED_SPECIAL_CHAR
    account = {}
    form = {
        privateKey: 'FB628AF4276F696AD1FA85B7AB1E49CFD896E5EC85000E3179EEEA59717DD8DE',
        networkType: 0,
        walletName: '',
        password: '',
        checkPW: '',
    }
    NetworkTypeList = [
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

    get getNode () {
        return this.$store.state.account.node
    }

    get currentXEM1(){
        return this.$store.state.account.currentXEM1
    }

    get currentXEM2(){
        return this.$store.state.account.currentXEM2
    }

    importWallet() {
        if (!this.checkPrivateKey()) return
        if (!this.checkImport()) return
        this.loginWallet(this.account)
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
        if (!passwordValidator(this.form.password)) {
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
        return true
    }

    checkPrivateKey() {
        try {
            if (!this.form.privateKey || this.form.privateKey === '') {
                this.$Notice.error({
                    title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
                })
                return false
            }
            const account = Account.createFromPrivateKey(this.form.privateKey, this.form.networkType)
            this.account = account
            return true
        } catch (e) {
            this.$Notice.error({
                title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''
            })
            return false
        }
    }

    loginWallet(account) {
        const that = this
        const walletName: any = this.form.walletName;
        const netType: NetworkType = this.form.networkType;
        const walletList = this.$store.state.app.walletList
        const style = 'walletItem_bg_' + walletList.length % 3
        getAccountDefault(walletName, account, netType, this.getNode, this.currentXEM1, this.currentXEM2)
            .then((wallet)=>{
                let storeWallet = wallet
                storeWallet['style'] = style
                that.$store.commit('SET_WALLET', storeWallet)
                const encryptObj = encryptKey(storeWallet['privateKey'], that.form['password'])
                saveLocalWallet(storeWallet, encryptObj, null,{})
                this.toWalletDetails()
            })
    }

    toWalletDetails() {
        this.$Notice.success({
            title: this['$t']('Import_private_key_operation') + '',
        });
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeImport')
    }

}
