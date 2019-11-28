import {Component, Vue} from 'vue-property-decorator'
import {formDataConfig, Message} from "@/config"
import {cloneData} from "@/core/utils"
import {AppAccounts, AppAccount, StoreAccount} from '@/core/model'
import {networkTypeConfig} from "@/config/view/setting"
import {NetworkType, Password} from "nem2-sdk"
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class CreateAccountInfoTs extends Vue {
    activeAccount: StoreAccount
    formItem = cloneData(formDataConfig.createAccountForm)
    networkTypeList = networkTypeConfig

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    checkInput() {
        const {accountName, currentNetType, password, passwordAgain} = this.formItem
        const appAccounts = AppAccounts()
        if (appAccounts.getAccountFromLocalStorage(accountName)) {
            this.$Notice.error({title: this.$t(Message.ACCOUNT_NAME_EXISTS_ERROR) + ''})
            return false
        }
        if (!accountName || accountName == '') {
            this.$Notice.error({title: this.$t(Message.ACCOUNT_NAME_INPUT_ERROR) + ''})
            return false
        }
        if (!password || password.length < 8) {
            this.$Notice.error({title: this.$t(Message.PASSWORD_SETTING_INPUT_ERROR) + ''})
            return false
        }
        if (passwordAgain !== password) {
            this.$Notice.error({title: this.$t(Message.INCONSISTENT_PASSWORD_ERROR) + ''})
            return false
        }
        if (!(currentNetType in NetworkType)) {
            this.$Notice.error({title: this.$t(Message.NETWORK_TYPE_INVALID) + ''})
            return false
        }
        return true
    }

    get appAccount(): AppAccount {
        let {accountName, password, currentNetType, hint} = this.formItem
        return AppAccount.create(password, accountName, [], hint, currentNetType)
    }

    submit() {
        if (!this.checkInput()) return
        const {appAccount} = this
        AppAccounts().saveAccountInLocalStorage(appAccount)
        this.$Notice.success({title: this.$t(Message.OPERATION_SUCCESS) + ''})
        this.$store.commit('SET_ACCOUNT_DATA', appAccount.currentAccount)
        this.$store.commit('SET_TEMPORARY_PASSWORD', appAccount.password)
        this.$router.push('generateMnemonic')
    }

    toBack() {
        this.appAccount.delete()
        this.$router.push('login')
    }
}
