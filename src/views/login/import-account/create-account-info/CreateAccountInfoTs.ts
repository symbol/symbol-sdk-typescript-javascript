import {Component, Vue} from 'vue-property-decorator'
import {formDataConfig, Message} from "@/config"
import {cloneData, localRead} from "@/core/utils"
import {AppAccounts, AppAccount, AppWallet, StoreAccount, CurrentAccount} from '@/core/model'
import {networkTypeConfig} from "@/config/view/setting"
import {mapState} from "vuex"
import {NetworkType} from "nem2-sdk"
import {getDefaultAccountNetworkType} from "@/core/utils"

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
    currentNetworkType = getDefaultAccountNetworkType()
    networkTypeList = networkTypeConfig

    get accountName() {
        return this.activeAccount.currentAccount.name
    }


    checkInput() {
        const {currentNetworkType} = this
        const {accountName, password, passwordAgain} = this.formItem
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
        if (!(currentNetworkType in NetworkType)) {
            this.$Notice.error({title: this.$t(Message.NETWORK_TYPE_INVALID) + ''})
            return false
        }
        return true
    }

    submit() {
        const {currentNetworkType} = this
        const appAccounts = AppAccounts()
        let {accountName, password, hint} = this.formItem
        if (!this.checkInput()) return
        const encryptedPassword = AppAccounts().encryptString(password, password)
        const appAccount = new AppAccount(accountName, [], encryptedPassword, hint, currentNetworkType)
        appAccounts.saveAccountInLocalStorage(appAccount)
        this.$Notice.success({title: this.$t(Message.OPERATION_SUCCESS) + ''})
        const currentAccount: CurrentAccount = {
            name: accountName,
            password: encryptedPassword,
            networkType: currentNetworkType,
        }
        this.$store.commit('SET_ACCOUNT_DATA', currentAccount)
        this.$store.commit('SET_TEMPORARY_PASSWORD', password)
        this.$router.push('importMnemonic')
    }
}
