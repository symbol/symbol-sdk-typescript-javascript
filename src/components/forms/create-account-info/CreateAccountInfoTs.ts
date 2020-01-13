import {Component, Provide, Vue} from 'vue-property-decorator'
import {formDataConfig, Message} from '@/config'
import {cloneData} from '@/core/utils'
import {AppAccounts, AppAccount, StoreAccount} from '@/core/model'
import {networkTypeConfig} from '@/config/view/setting'
import {mapState} from 'vuex'
import {getDefaultAccountNetworkType} from '@/core/utils'
import {validation} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {Endpoints} from '@/core/services'

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
})
export class CreateAccountInfoTs extends Vue {
  @Provide() validator: any = this.$validator
  validation = validation
  activeAccount: StoreAccount
  formItem = cloneData(formDataConfig.createAccountForm)
  currentNetworkType = getDefaultAccountNetworkType()
  networkTypeList = networkTypeConfig

  get nextPage() {
    return this.$route.meta.nextPage
  }

  get appAccount(): AppAccount {
    const {currentNetworkType} = this
    const {accountName, password, hint} = this.formItem
    return AppAccount.create(password, accountName, [], hint, currentNetworkType)
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.createNewAccount()
      })
  }

  createNewAccount() {
    const {appAccount,currentNetworkType} = this
    AppAccounts().saveAccountInLocalStorage(appAccount)
    this.$Notice.success({title: `${this.$t(Message.OPERATION_SUCCESS)}`})
    this.$store.commit('SET_ACCOUNT_DATA', appAccount.currentAccount)
    this.$store.commit('SET_TEMPORARY_PASSWORD', this.formItem.password)
    Endpoints.setNodeInfo(currentNetworkType,this.$store)
    this.$router.push({name:this.nextPage})
  }
}
