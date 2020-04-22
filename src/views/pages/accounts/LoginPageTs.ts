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
import {Component, Vue} from 'vue-property-decorator'
import {NetworkType, Password} from 'symbol-sdk'
// internal dependencies
import {$eventBus} from '@/events'
import {NotificationType} from '@/core/utils/NotificationType'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {AccountService} from '@/services/AccountService'
// child components
// @ts-ignore
import {ValidationObserver, ValidationProvider} from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue'
// configuration
import {SettingService} from '@/services/SettingService'
import {SettingsModel} from '@/core/database/entities/SettingsModel'
import {WalletService} from '@/services/WalletService'
import {NetworkTypeHelper} from '@/core/utils/NetworkTypeHelper'

@Component({
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      isAuthenticated: 'account/isAuthenticated',
    }),
  },
  components: {
    ErrorTooltip,
    ValidationProvider,
    ValidationObserver,
    LanguageSelector,
  },
})

export default class LoginPageTs extends Vue {
  /**
   * All known accounts
   */
  private accounts: AccountModel[]

  /**
   * Account indexed by network type
   */
  private accountsClassifiedByNetworkType: { networkType: NetworkType, accounts: AccountModel[] }[]
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountModel

  /**
   * Accounts repository
   * @var {AccountService}
   */
  public accountService = new AccountService()

  public walletService = new WalletService()

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  /**
   * Form items
   */
  public formItems: any = {
    currentAccountName: '',
    password: '',
    hasHint: false,
  }

  /// end-region computed properties getter/setter

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  public created() {
    this.accounts = this.accountService.getAccounts()

    const reducer = (accumulator: { networkType: NetworkType, accounts: AccountModel[] }[],
      currentValue: AccountModel) => {

      const currentAccumulator = accumulator.find(a => a.networkType == currentValue.networkType)
      if (currentAccumulator) {
        currentAccumulator.accounts.push(currentValue)
        return accumulator
      } else {
        return [ ...accumulator, {networkType: currentValue.networkType, accounts: [currentValue]}]
      }
    }

    this.accountsClassifiedByNetworkType = this.accounts.reduce(reducer, [])
    if (!this.accounts.length) {
      return
    }
    // accounts available, iterate to first account
    this.formItems.currentAccountName = this.accounts[0].accountName
  }

  /**
   * Getter for network type label
   * @param {NetworkType} networkType
   * @return {string}
   */
  public getNetworkTypeLabel(networkType: NetworkType): string {
    return NetworkTypeHelper.getNetworkTypeLabel(networkType)
  }

  /**
   * Get account password hint
   * XXX should be encrypted with accessSalt.
   * @return {string}
   */
  public getPasswordHint(): string {
    const accountName = this.formItems.currentAccountName
    const account = this.accountService.getAccountByName(accountName)
    return account && account.hint || ''
  }

  /**
   * Submit action, validates form and logs in user if valid
   * @return {void}
   */
  public async submit() {
    if (!this.formItems.currentAccountName.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.ACCOUNT_NAME_INPUT_ERROR)
    }

    if (!this.formItems.password.length || this.formItems.password.length < 8) {
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
    const currentAccountName = this.formItems.currentAccountName
    const account = this.accountService.getAccountByName(currentAccountName)
    const settingService = new SettingService()

    // if account doesn't exist, authentication is not valid
    if (!account) {
      this.$store.dispatch('diagnostic/ADD_ERROR', 'Invalid login attempt')
      return this.$router.push({name: 'accounts.login'})
    }

    // account exists, fetch data
    const settings: SettingsModel = settingService.getAccountSettings(currentAccountName)

    const knownWallets: WalletModel[] = this.walletService.getKnownWallets(account.wallets)
    if (knownWallets.length == 0) {
      throw new Error('knownWallets is empty')
    }

    // use service to generate password hash
    const passwordHash = AccountService.getPasswordHash(new Password(this.formItems.password))

    // read account's password hash and compare
    const accountPass = account.password

    if (accountPass !== passwordHash) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.WRONG_PASSWORD_ERROR)
    }

    // if account setup was not finalized, redirect
    if (!account.seed) {
      this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account)
      this.$store.dispatch('temporary/SET_PASSWORD', this.formItems.password)
      this.$store.dispatch('diagnostic/ADD_WARNING', 'Account has not setup mnemonic pass phrase, redirecting: ' + currentAccountName)
      return this.$router.push({name: 'accounts.createAccount.generateMnemonic'})
    }

    // read default wallet from settings
    const defaultWalletId = settings.defaultWallet ? settings.defaultWallet : knownWallets[0].id
    if (!defaultWalletId) {
      throw new Error('defaultWalletId could not be resolved')
    }
    const defaultWallet = knownWallets.find(w => w.id == defaultWalletId)
    if (!defaultWallet) {
      throw new Error(`defaultWallet could not be resolved from id ${defaultWalletId}`)
    }

    // LOGIN SUCCESS: update app state
    await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account)
    await this.$store.dispatch('wallet/SET_CURRENT_WALLET', defaultWallet)
    this.$store.dispatch('wallet/SET_KNOWN_WALLETS', account.wallets)
    this.$store.dispatch('diagnostic/ADD_DEBUG', 'Account login successful with currentAccountName: ' + currentAccountName)

    $eventBus.$emit('onLogin', currentAccountName)
    return this.$router.push({name: 'dashboard'})
  }
}
