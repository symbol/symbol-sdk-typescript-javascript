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
import { AccountInfo, Address, MosaicId, Password, RepositoryFactory, SimpleWallet } from 'symbol-sdk'
import { MnemonicPassPhrase } from 'symbol-hd-wallets'
// internal dependencies
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel'
import { DerivationPathLevels, DerivationService } from '@/services/DerivationService'
import { AccountService } from '@/services/AccountService'
import { NotificationType } from '@/core/utils/NotificationType'
import { Formatters } from '@/core/utils/Formatters'
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
import { NetworkCurrencyModel } from '@/core/database/entities/NetworkCurrencyModel'
import { ProfileModel } from '@/core/database/entities/ProfileModel'
import { ProfileService } from '@/services/ProfileService'
import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage'

@Component({
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      networkMosaic: 'mosaic/networkMosaic',
      networkCurrency: 'mosaic/networkCurrency',
      currentProfile: 'profile/currentProfile',
      currentPassword: 'temporary/password',
      currentMnemonic: 'temporary/mnemonic',
    }),
  },
  components: { MosaicAmountDisplay },
})
export default class AccountSelectionTs extends Vue {
  /**
   * Formatting helpers
   * @protected
   */
  protected formatters = Formatters

  /**
   * Network's currency mosaic id
   * @see {Store.Mosaic}
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Currently active profile
   * @see {Store.Profile}
   * @var {string}
   */
  public currentProfile: ProfileModel

  /**
   * Temporary stored password
   * @see {Store.Temporary}
   * @var {Password}
   */
  public currentPassword: Password

  /**
   * Temporary stored mnemonic pass phrase
   * @see {Store.Temporary}
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: string

  /**
   * Derivation Service
   * @var {DerivationService}
   */
  public derivation: DerivationService

  /**
   * Account Service
   * @var {AccountService}
   */
  public accountService: AccountService

  /**
   * Profile service
   * @var {ProfileService}
   */
  public profileService: ProfileService = new ProfileService()

  /**
   * List of addresses
   * @var {Address[]}
   */
  public addressesList: Address[] = []

  /**
   * Balances map
   * @var {any}
   */
  public addressMosaicMap = {}

  /**
   * Map of selected accounts
   * @var {number[]}
   */
  public selectedAccounts: number[] = []

  public networkCurrency: NetworkCurrencyModel

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  async mounted() {
    this.derivation = new DerivationService()
    this.accountService = new AccountService()

    Vue.nextTick().then(() => {
      setTimeout(() => this.initAccounts(), 200)
    })
  }

  /**
   * Finalize the account selection process by adding
   * the selected accounts to storage.
   * @return {void}
   */
  public submit() {
    // cannot submit without selecting at least one account
    if (!this.selectedAccounts.length) {
      return this.$store.dispatch('notification/ADD_ERROR', NotificationType.INPUT_EMPTY_ERROR)
    }

    try {
      // create account models
      const accounts = this.createAccountsFromPathIndexes(this.selectedAccounts)

      // save newly created accounts
      accounts.forEach((account, index) => {
        // Store accounts using repository
        this.accountService.saveAccount(account)
        // set current account
        if (index === 0) this.$store.dispatch('account/SET_CURRENT_ACCOUNT', account)
        // add accounts to profile
        this.$store.dispatch('profile/ADD_ACCOUNT', account)
      })

      // get accounts identifiers
      const accountIdentifiers = accounts.map((account) => account.id)

      // set known accounts
      this.$store.dispatch('account/SET_KNOWN_ACCOUNTS', accountIdentifiers)

      this.profileService.updateAccounts(this.currentProfile, accountIdentifiers)

      // execute store actions
      this.$store.dispatch('temporary/RESET_STATE')
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      return this.$router.push({ name: 'profiles.importProfile.finalize' })
    } catch (error) {
      return this.$store.dispatch('notification/ADD_ERROR', error)
    }
  }

  /**
   * Fetch account balances and map to address
   * @return {void}
   */
  private async initAccounts() {
    // - generate addresses
    this.addressesList = this.accountService.getAddressesFromMnemonic(
      new MnemonicPassPhrase(this.currentMnemonic),
      this.currentProfile.networkType,
      10,
    )
    const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory
    // fetch accounts info
    const accountsInfo = await repositoryFactory
      .createAccountRepository()
      .getAccountsInfo(this.addressesList)
      .toPromise()
    if (!accountsInfo) return
    // map balances
    this.addressMosaicMap = this.mapBalanceByAddress(accountsInfo, this.networkMosaic)
  }

  public mapBalanceByAddress(accountsInfo: AccountInfo[], mosaic: MosaicId): Record<string, number> {
    return accountsInfo
      .map(({ mosaics, address }) => {
        // - check balance
        const hasNetworkMosaic = mosaics.find((mosaicOwned) => mosaicOwned.id.equals(mosaic))

        // - account doesn't hold network mosaic
        if (hasNetworkMosaic === undefined) {
          return null
        }
        // - map balance to address
        const balance = hasNetworkMosaic.amount.compact()
        return {
          address: address.plain(),
          balance: balance,
        }
      })
      .reduce((acc, { address, balance }) => ({ ...acc, [address]: balance }), {})
  }

  /**
   * Create an account instance from mnemonic and path
   * @return {AccountModel}
   */
  private createAccountsFromPathIndexes(indexes: number[]): AccountModel[] {
    const paths = indexes.map((index) => {
      if (index == 0) return AccountService.DEFAULT_ACCOUNT_PATH

      return this.derivation.incrementPathLevel(
        AccountService.DEFAULT_ACCOUNT_PATH,
        DerivationPathLevels.Profile,
        index,
      )
    })

    const accounts = this.accountService.generateAccountsFromPaths(
      new MnemonicPassPhrase(this.currentMnemonic),
      this.currentProfile.networkType,
      paths,
    )

    const simpleWallets = accounts.map((account, i) =>
      SimpleWallet.createFromPrivateKey(
        `Seed Account ${indexes[i] + 1}`,
        this.currentPassword,
        account.privateKey,
        this.currentProfile.networkType,
      ),
    )

    return simpleWallets.map((simpleWallet, i) => {
      return {
        id: SimpleObjectStorage.generateIdentifier(),
        profileName: this.currentProfile.profileName,
        name: simpleWallet.name,
        node: '',
        type: AccountType.SEED,
        address: simpleWallet.address.plain(),
        publicKey: accounts[i].publicKey,
        encryptedPrivateKey: simpleWallet.encryptedPrivateKey,
        path: paths[i],
        isMultisig: false,
      }
    })
  }

  /**
   * Called when clicking on an address to add it to the selection
   * @param {number} pathNumber
   */
  protected onAddAddress(pathNumber: number): void {
    const selectedAccounts = [...this.selectedAccounts]
    selectedAccounts.push(pathNumber)
    this.selectedAccounts = selectedAccounts
  }

  /**
   * Called when clicking on an address to remove it from the selection
   * @protected
   * @param {number} pathNumber
   */
  protected onRemoveAddress(pathNumber: number): void {
    const selectedAccounts = [...this.selectedAccounts]
    const indexToDelete = selectedAccounts.indexOf(pathNumber)
    selectedAccounts.splice(indexToDelete, 1)
    this.selectedAccounts = selectedAccounts
  }
}
