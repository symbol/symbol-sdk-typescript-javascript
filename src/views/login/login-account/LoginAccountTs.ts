/**
 * Copyright 2020 NEM Foundation (https://nem.io)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {mapGetters} from 'vuex'
import {Component, Provide, Vue} from 'vue-property-decorator'
import {NetworkType, Password} from 'nem2-sdk'

// internal dependencies
import {$eventBus} from '@/events'
import {NotificationType} from '@/core/utils/NotificationType'
import {ValidationRuleset} from '@/core/validators/ValidationRuleset'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {AccountService} from '@/services/AccountService'

// child components
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'

// configuration
import appConfig from '@/../config/app.conf.json'

@Component({
  computed: {
    ...mapGetters({
      currentLanguage: 'app/currentLanguage',
      currentAccount: 'account/currentAccount',
      isAuthenticated: 'account/isAuthenticated',
    }),
  },
  components: {
    ErrorTooltip,
  },
})
export default class LoginAccountTs extends Vue {
  @Provide() validator: any = this.$validator

  /**
   * Currently active language
   * @see {Store.AppInfo}
   * @var {string}
   */
  public currentLanguage: string

  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountsModel

  /**
   * List of languages
   * @see {Config.app}
   * @var {any[]}
   */
  public languageList: any[] = appConfig.languages

  /**
   * Accounts repository
   * @var {AccountsRepository}
   */
  public accountsRepository = new AccountsRepository()

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Network types
   * @var {NetworkNodeEntry[]}
   */
  public networkTypeList: {value: NetworkType, label: string}[] = [
    {value: NetworkType.MIJIN_TEST, label: 'MIJIN_TEST'},
    {value: NetworkType.MAIN_NET, label: 'MAIN_NET'},
    {value: NetworkType.TEST_NET, label: 'TEST_NET'},
    {value: NetworkType.MIJIN, label: 'MIJIN'},
  ]

  /**
   * Form items
   */
  public formItems: any = {
    currentAccountName: '',
    password: '',
    hasHint: false,
  }

/// region computed properties getter/setter
  get language() {
    return this.currentLanguage
  }

  set language(lang) {
    this.$store.commit('app/SET_LANGUAGE', lang)
  }

  get accountsClassifiedByNetworkType() {
    const repository = new AccountsRepository()
    return repository.getNamesByNetworkType()
  }
/// end-region computed properties getter/setter

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  public mounted() {
    if (this.currentAccount) {
      this.formItems.currentAccountName = this.currentAccount.values.get('accountName')
      return
    }

    // no account pre-selected, select first if available
    const accounts = this.accountsRepository.entries()
    if (! accounts.size) {
      return
    }

    // accounts available, iterate to first account
    const firstAccount = this.accountsRepository.collect().shift()
    this.formItems.currentAccountName = firstAccount.values.get('accountName')
  }

  /**
   * Getter for network type label
   * @param {NetworkType} networkType 
   * @return {string}
   */
  public getNetworkTypeLabel(networkType: NetworkType): string {
    const findType = this.networkTypeList.find(n => n.value === networkType)
    if (findType === undefined) {
      return ''
    }
    return findType.label
  }

  /**
   * Get account password hint
   * XXX should be encrypted with accessSalt.
   * @return {string}
   */
  public getPasswordHint(): string {
    const identifier = this.formItems.currentAccountName

    // if account doesn't exist, authentication is not valid
    if (! this.accountsRepository.find(identifier)) {
      return ''
    }

    // account exists, fetch data
    const account: AccountsModel = this.accountsRepository.read(identifier)
    return account.values.get('hint')
  }

  /**
   * Submit action, validates form and logs in user if valid
   * @return {void}
   */
  public submit() {
    if (! this.formItems.currentAccountName.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.ACCOUNT_NAME_INPUT_ERROR)
    }

    if (! this.formItems.password.length || this.formItems.password.length < 8) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
    }

    // now compare password hashes
    return this.processLogin()
  }

  /**
   * Process login request.
   * @return {void}
   */
  private async processLogin() {
    const identifier = this.formItems.currentAccountName

    // if account doesn't exist, authentication is not valid
    if (! this.accountsRepository.find(identifier)) {
      return this.$router.push({name: 'login.account'})
    }

    // account exists, fetch data
    const account: AccountsModel = this.accountsRepository.read(identifier)

    // if account setup was not finalized, redirect
    if (!account.values.has('seed') || ! account.values.get('seed').length) {
      return this.$router.push({name: 'login.createAccount.generateMnemonic'})
    }

    // use service to generate password hash
    const service = new AccountService(this.$store)
    const passwordHash = service.getPasswordHash(new Password(this.formItems.password))

    // read account's password hash and compare
    const accountPass = account.values.get('password')

    if (accountPass !== passwordHash) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
    }

    // LOGIN SUCCESS: update app state
    await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', identifier)
    $eventBus.$emit('onLogin', identifier)
    return this.$router.push({name: 'dashboard'})
  }
}
