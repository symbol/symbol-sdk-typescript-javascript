/*
 * Copyright 2020 NEM Foundation (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Component, Vue } from 'vue-property-decorator'
import { mapGetters } from 'vuex'
import { Account, NetworkType, Password, Crypto } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
import { ValidationRuleset } from '@/core/validation/ValidationRuleset'
import { DerivationService } from '@/services/DerivationService'
import { NotificationType } from '@/core/utils/NotificationType'
import { AccountService } from '@/services/AccountService'
import { AccountModel } from '@/core/database/entities/AccountModel'
// child components
import { ValidationObserver, ValidationProvider } from 'vee-validate'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue'
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue'
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue'
// configuration
import appConfig from '@/../config/app.conf.json'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { FilterHelpers } from '@/core/utils/FilterHelpers'

const { MAX_SEED_ACCOUNTS_NUMBER } = appConfig.constants

@Component({
  components: {
    ValidationObserver,
    ValidationProvider,
    ErrorTooltip,
    FormWrapper,
    FormRow,
    ModalFormProfileUnlock,
  },
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      currentProfile: 'profile/currentProfile',
      knownAccounts: 'account/knownAccounts',
    }),
  },
})
export class FormSubAccountCreationTs extends Vue {
  /**
   * Currently active profile
   */
  public currentProfile: ProfileModel

  /**
   * Known accounts identifiers
   */
  public knownAccounts: AccountModel[]

  /**
   * Currently active network type
   */
  public networkType: NetworkType

  /**
   * Accounts repository
   */
  public accountService: AccountService

  /**
   * Derivation paths service
   */
  public paths: DerivationService

  /**
   * Validation rules
   */
  public validationRules = ValidationRuleset

  /**
   * Whether account is currently being unlocked
   */
  public isUnlockingAccount: boolean = false

  /**
   * Current unlocked password
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Form fields
   * @var {Object}
   */
  public formItems = {
    type: 'child_account',
    privateKey: '',
    name: '',
  }

  /**
   * Type the ValidationObserver refs
   * @type {{
   *     observer: InstanceType<typeof ValidationObserver>
   *   }}
   */
  public $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  public created() {
    this.accountService = new AccountService()
    this.paths = new DerivationService()
  }

  /// region computed properties getter/setter
  public get hasAccountUnlockModal(): boolean {
    return this.isUnlockingAccount
  }

  public set hasAccountUnlockModal(f: boolean) {
    this.isUnlockingAccount = f
  }

  public get knownPaths(): string[] {
    if (!this.knownAccounts || !this.knownAccounts.length) {
      return []
    }
    // filter accounts to only known account names
    return this.knownAccounts.map((a) => a.path).filter((p) => p)
  }

  /// end-region computed properties getter/setter

  /**
   * Submit action asks for account unlock
   * @return {void}
   */
  public onSubmit() {
    this.hasAccountUnlockModal = true

    // // resets form validation
    // this.$nextTick(() => {
    //   this.$refs.observer.reset()
    // })
  }

  /**
   * When account is unlocked, the sub account can be created
   */
  public async onAccountUnlocked(account: Account, password: Password) {
    this.currentPassword = password

    // - interpret form items
    const values = { ...this.formItems }
    const type =
      values.type && ['child_account', 'privatekey_account'].includes(values.type) ? values.type : 'child_account'

    try {
      // - create sub account (can be either derived or by private key)
      let subAccount: AccountModel
      switch (type) {
        default:
        case 'child_account':
          subAccount = this.deriveNextChildAccount(values.name)
          break

        case 'privatekey_account':
          subAccount = this.accountService.getSubAccountByPrivateKey(
            this.currentProfile,
            this.currentPassword,
            this.formItems.name,
            this.formItems.privateKey,
            this.networkType,
          )
          break
      }

      // - return if subAccount is undefined
      if (!subAccount) return

      // Verify that the import is repeated
      const hasAddressInfo = this.knownAccounts.find((w) => w.address === subAccount.address)
      if (hasAddressInfo !== undefined) {
        this.$store.dispatch(
          'notification/ADD_ERROR',
          `This private key already exists. The account name is ${hasAddressInfo.name}`,
        )
        return null
      }

      // - remove password before GC
      this.currentPassword = null

      // - use repositories for storage
      this.accountService.saveAccount(subAccount)

      // - update app state
      await this.$store.dispatch('profile/ADD_ACCOUNT', subAccount)
      await this.$store.dispatch('account/SET_CURRENT_ACCOUNT', subAccount)
      await this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', this.currentProfile.accounts)
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$emit('submit', this.formItems)
    } catch (e) {
      this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.')
      console.error(e)
    }
  }

  /**
   * Use HD account derivation to get next child account
   * @param {string} child account name
   * @return {AccountModel}
   */
  private deriveNextChildAccount(childAccountName: string): AccountModel | null {
    // - don't allow creating more than 10 accounts
    if (this.knownPaths.length >= MAX_SEED_ACCOUNTS_NUMBER) {
      this.$store.dispatch(
        'notification/ADD_ERROR',
        this.$t(NotificationType.TOO_MANY_SEED_ACCOUNTS_ERROR, {
          maxSeedAccountsNumber: MAX_SEED_ACCOUNTS_NUMBER,
        }),
      )
      return null
    }

    // - get next path
    const nextPath = this.paths.getNextAccountPath(this.knownPaths)

    this.$store.dispatch('diagnostic/ADD_DEBUG', 'Adding child account with derivation path: ' + nextPath)

    // - decrypt mnemonic
    const encSeed = this.currentProfile.seed
    const passphrase = Crypto.decrypt(encSeed, this.currentPassword.value)
    const mnemonic = new MnemonicPassPhrase(passphrase)

    // create account by mnemonic
    return this.accountService.getChildAccountByPath(
      this.currentProfile,
      this.currentPassword,
      mnemonic,
      nextPath,
      this.networkType,
      childAccountName,
    )
  }
  /**
   * filter tags
   */
  public stripTagsAccountName() {
    this.formItems.name = FilterHelpers.stripFilter(this.formItems.name)
  }
}
