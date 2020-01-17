import {Component, Provide, Vue} from 'vue-property-decorator'
import { Password } from 'nem2-sdk'
import {mapState} from 'vuex'
import {
  formDataConfig, Message} from '@/config'
import {cloneData} from '@/core/utils'
import {networkTypeConfig} from '@/config/view/setting'
import {getDefaultAccountNetworkType} from '@/core/utils'
import {validation} from '@/core/validation'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {Endpoints} from '@/core/services'
import {StoreAccount} from '@/store/account/StoreAccount'
import {
  AccountsModel,
  AppAccount
} from '@/core/model/AppAccount'
import {AccountsRepository} from '@/core/repositories/AccountsRepository'
import {ProtectedStorageAdapter} from '@/core/services/database/ProtectedStorageAdapter'

let accountsRepository: AccountsRepository = new AccountsRepository()

@Component({
  components: {
    ErrorTooltip,
  },
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  }
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
    return new AppAccount(
      this.formItem.accountName,
      [],
      this.formItem.password,
      this.formItem.hint,
      this.currentNetworkType,
    )
  }

  submit() {
    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.persistAccountAndContinue()
      })
  }

  persistAccountAndContinue() {
    // persist newly created account
    accountsRepository.create(this.appAccount.model.values)

    // notify
    this.$Notice.success({title: `${this.$t(Message.OPERATION_SUCCESS)}`})

    // mutate store
    this.$store.commit('SET_ACCOUNT_DATA', this.appAccount)
    this.$store.commit('SET_TEMPORARY_PASSWORD', this.formItem.password)

    // flush and continue
    Endpoints.setNodeInfo(this.currentNetworkType, this.$store)
    this.$router.push({name:this.nextPage})
  }
}
