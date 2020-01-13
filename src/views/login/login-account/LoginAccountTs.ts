import {languageConfig, Message} from '@/config'
import {StoreAccount} from '@/core/model'
import {Component, Provide, Vue, Watch} from 'vue-property-decorator'
import {getTopValueInObject, localSave, localRead} from '@/core/utils/utils'
import {validation} from '@/core/validation'
import {mapState} from 'vuex'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import {Endpoints, onLogin} from '@/core/services'
import {NetworkType} from 'nem2-sdk'

@Component({
  computed: {
    ...mapState({activeAccount: 'account'}),
  },
  components: {
    ErrorTooltip,
  },
})
export default class LoginAccountTs extends Vue {
  @Provide() validator: any = this.$validator
  activeAccount: StoreAccount
  languageList = languageConfig
  validation = validation
  cipher = ''
  cipherHint = ''
  errors: any
  isShowHint = false
  hintText = ''
  onLogin = onLogin
  NetworkType = NetworkType
  formItems = {
    currentAccountName: '',
    password: '',
  }

  get language() {
    return this.$i18n.locale
  }

  set language(lang) {
    this.$i18n.locale = lang
    localSave('locale', lang)
  }

  get accountMap() {
    return localRead('accountMap') ? JSON.parse(localRead('accountMap')) : {}
  }

  get accountPassword() {
    if (!this.accountMap[this.formItems.currentAccountName]) return null
    return this.formItems.currentAccountName ? this.accountMap[this.formItems.currentAccountName].password : null
  }

  get networkType() {
    return this.activeAccount.currentAccount.networkType
  }

  get accountsClassifiedByNetworkType() {
    const {accountMap} = this
    if(!Object.keys(accountMap).length) return null

    return Object.keys(accountMap)
      .filter((accountName: string) => accountMap[accountName].wallets.length)
      .map((accountName: string) => ({
        accountName,
        networkType: accountMap[accountName].networkType,
      }))
      .reduce((acc, account) => {
        if (!acc[account.networkType]) acc[account.networkType] = []
        acc[account.networkType].push(account.accountName)
        return acc
      }, {})
  }

  toChooseImportWay() {
    this.$router.push('chooseImportWay')
  }

  showErrorNotice(text) {
    this.$Notice.destroy()
    this.$Notice.error({title: `${this.$t(text)}`})
  }

  submit() {
    const {currentAccountName} = this.formItems
    if (this.errors.items.length > 0) {
      this.showErrorNotice(this.errors.items[0].msg)
      return
    }
    if (!currentAccountName) {
      this.showErrorNotice(Message.ACCOUNT_NAME_INPUT_ERROR)
      return
    }

    this.$validator
      .validate()
      .then((valid) => {
        if (!valid) return
        this.login()
      })
  }

  login() {
    localSave('activeAccountName',this.formItems.currentAccountName)
    if (this.noSeedAvailable()) {
      this.createNewAccount()
      return
    }

    this.onLogin(this.formItems.currentAccountName, this.$store)
    this.goToDashBoard()
  }

  createNewAccount() {
    this.$store.commit('SET_TEMPORARY_PASSWORD', this.formItems.password)
    this.$router.push('generateMnemonic')
    return
  }

  noSeedAvailable(): boolean {
    const {currentAccountName} = this.formItems
    if (!currentAccountName || currentAccountName === '') return true
    if (!this.accountMap) return true
    if (!this.accountMap[currentAccountName]) return true
    if (!this.accountMap[currentAccountName].seed) return true
    return false
  }

  goToDashBoard() {
    Endpoints.setNodeInfo(this.networkType,this.$store)
    this.$router.push('monitorPanel')
  }

  @Watch('formItems.currentAccountName')
  onAccountNameChange(newVal, oldVal) {
    if (newVal === oldVal) return
    const {currentAccountName} = this.formItems
    const {accountMap} = this
    if (!accountMap[currentAccountName]) return
    this.cipher = this.accountPassword
    this.hintText = accountMap[currentAccountName].hint
  }


  mounted() {
    const {accountMap} = this
    const activeAccountName = localRead('activeAccountName')
    if (activeAccountName) {
      this.formItems.currentAccountName = activeAccountName
      return
    }
    if (!getTopValueInObject(accountMap)) return
    this.formItems.currentAccountName = getTopValueInObject(accountMap).accountName
  }
}
