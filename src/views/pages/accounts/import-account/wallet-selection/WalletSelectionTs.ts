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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {AccountInfo, Address, MosaicId, Password, RepositoryFactory, SimpleWallet} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'
// internal dependencies
import {WalletModel, WalletType} from '@/core/database/entities/WalletModel'
import {DerivationPathLevels, DerivationService} from '@/services/DerivationService'
import {WalletService} from '@/services/WalletService'
import {NotificationType} from '@/core/utils/NotificationType'
import {Formatters} from '@/core/utils/Formatters'
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {AccountModel} from '@/core/database/entities/AccountModel'
import {AccountService} from '@/services/AccountService'
import {SimpleObjectStorage} from '@/core/database/backends/SimpleObjectStorage'

@Component({
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      networkMosaic: 'mosaic/networkMosaic',
      networkCurrency: 'mosaic/networkCurrency',
      currentAccount: 'account/currentAccount',
      currentPassword: 'temporary/password',
      currentMnemonic: 'temporary/mnemonic',
    }),
  },
  components: {MosaicAmountDisplay},
})
export default class WalletSelectionTs extends Vue {
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
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountModel

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
   * Wallet Service
   * @var {DerivationService}
   */
  public derivation: DerivationService

  /**
   * Wallet Service
   * @var {WalletService}
   */
  public walletService: WalletService

  /**
   * Accounts Repository
   * @var {AccountService}
   */
  public accountService: AccountService = new AccountService()

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
    this.walletService = new WalletService()

    Vue.nextTick().then(() => {
      setTimeout(() => this.initAccounts(), 200)
    })
  }

  /**
   * Finalize the wallet selection process by adding
   * the selected wallets to storage.
   * @return {void}
   */
  public submit() {
    // cannot submit without selecting at least one wallet
    if (!this.selectedAccounts.length) {
      return this.$store.dispatch(
        'notification/ADD_ERROR',
        NotificationType.INPUT_EMPTY_ERROR,
      )
    }

    try {
      // create wallet models
      const wallets = this.createWalletsFromPathIndexes(this.selectedAccounts)

      // save newly created wallets
      wallets.forEach((wallet, index) => {
        // Store wallets using repository
        this.walletService.saveWallet(wallet)
        // set current wallet
        if (index === 0) this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet)
        // add wallets to account
        this.$store.dispatch('account/ADD_WALLET', wallet)
      })

      // get wallets identifiers
      const walletIdentifiers = wallets.map(wallet => wallet.id)

      // set known wallets
      this.$store.dispatch('wallet/SET_KNOWN_WALLETS', walletIdentifiers)

      this.accountService.updateWallets(this.currentAccount, walletIdentifiers)


      // execute store actions
      this.$store.dispatch('temporary/RESET_STATE')
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      return this.$router.push({name: 'accounts.importAccount.finalize'})
    } catch (error) {
      return this.$store.dispatch(
        'notification/ADD_ERROR',
        error,
      )
    }
  }

  /**
   * Fetch account balances and map to address
   * @return {void}
   */
  private async initAccounts() {
    // - generate addresses
    this.addressesList = this.walletService.getAddressesFromMnemonic(
      new MnemonicPassPhrase(this.currentMnemonic),
      this.currentAccount.networkType,
      10,
    )
    const repositoryFactory = this.$store.getters['network/repositoryFactory'] as RepositoryFactory
    // fetch accounts info
    const accountsInfo = await repositoryFactory.createAccountRepository()
      .getAccountsInfo(this.addressesList).toPromise()
    if (!accountsInfo) return
    // map balances
    this.addressMosaicMap = this.mapBalanceByAddress(
      accountsInfo,
      this.networkMosaic,
    )
  }

  public mapBalanceByAddress(accountsInfo: AccountInfo[], mosaic: MosaicId): Record<string, number> {
    return accountsInfo.map(({mosaics, address}) => {
      // - check balance
      const hasNetworkMosaic = mosaics.find(mosaicOwned => mosaicOwned.id.equals(mosaic))

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
    }).reduce((acc, {address, balance}) => ({...acc, [address]: balance}), {})
  }

  /**
   * Create a wallet instance from mnemonic and path
   * @return {WalletModel}
   */
  private createWalletsFromPathIndexes(indexes: number[]): WalletModel[] {
    const paths = indexes.map(index => {
      if (index == 0) return WalletService.DEFAULT_WALLET_PATH

      return this.derivation.incrementPathLevel(
        WalletService.DEFAULT_WALLET_PATH,
        DerivationPathLevels.Account,
        index,
      )
    })


    const accounts = this.walletService.generateAccountsFromPaths(
      new MnemonicPassPhrase(this.currentMnemonic),
      this.currentAccount.networkType,
      paths,
    )

    const simpleWallets = accounts.map(account =>
      SimpleWallet.createFromPrivateKey(
        'SeedWallet',
        this.currentPassword,
        account.privateKey,
        this.currentAccount.networkType,
      ))

    return simpleWallets.map((simpleWallet, i) => {
      return {
        id: SimpleObjectStorage.generateIdentifier(),
        accountName: this.currentAccount.accountName,
        name: `Seed Account${indexes[i] + 1}`,
        node: '',
        type: WalletType.SEED,
        address: simpleWallet.address.plain(),
        publicKey: accounts[i].publicKey,
        encPrivate: simpleWallet.encryptedPrivateKey.encryptedKey,
        encIv: simpleWallet.encryptedPrivateKey.iv,
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
