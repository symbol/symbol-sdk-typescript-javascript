import {Component, Vue} from 'vue-property-decorator'
import {Message} from "@/config"
import {AppLock} from "@/core/utils"
import {AppAccounts, AppAccount} from '@/core/model'
import {networkTypeConfig} from "@/config/view/setting"
import {NetworkType} from "nem2-sdk"

@Component
export class CreateAccountTs extends Vue {
    formItem = {
        accountName: '',
        password: '',
        passwordAgain: '',
        hint: '',
        currentNetType: NetworkType.MIJIN_TEST,
    }
    networkTypeList = networkTypeConfig

    checkInput() {
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
        return true
    }

    createAccount() {
        const appAccounts = AppAccounts()
        let {accountName, password, currentNetType, hint} = this.formItem
        if (!this.checkInput()) return
        password = AppLock.encryptString(password, password)
        const appAccount = new AppAccount(accountName, [], password, hint, currentNetType)
        appAccounts.saveAccountInLocalStorage(appAccount)
        this.$Notice.success({title: this.$t(Message.OPERATION_SUCCESS) + ''})
        this.$store.commit('SET_ACCOUNT_NAME', accountName)
        this.$router.push({
            name: 'initSeed',
            params: {
                initType: '1'
            }
        })
    }

    toBack() {
        this.$router.push('login')
    }
}
