import {Component, Provide, Vue} from 'vue-property-decorator'
import {AppAccount, AppAccounts, CurrentAccount} from '@/core/model'
import {Message, formDataConfig, networkTypeConfig} from "@/config"
import {cloneData} from "@/core/utils"
import {validation} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({ components: {ErrorTooltip} })
export class CreateAccountTs extends Vue {
    @Provide() validator: any = this.$validator
    validation = validation
    networkTypeList = networkTypeConfig
    formItem = cloneData(formDataConfig.createAccountForm)

    createAccount() {
        const appAccounts = AppAccounts()
        let {accountName, password, networkType, hint} = this.formItem
        const encryptedPassword = AppAccounts().encryptString(password, password)
        const appAccount = new AppAccount(accountName, [], encryptedPassword, hint, networkType)
        appAccounts.saveAccountInLocalStorage(appAccount)
        this.$Notice.success({title: this.$t(Message.OPERATION_SUCCESS) + ''})

        const currentAccount: CurrentAccount = {
            name: accountName,
            password: encryptedPassword,
            networkType,
        }

        this.$store.commit('SET_ACCOUNT_DATA', currentAccount)

        this.$router.push({
            name: 'initSeed',
            params: {
                initType: '1'
            }
        })
    }

    submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.createAccount()
            })
    }
}
