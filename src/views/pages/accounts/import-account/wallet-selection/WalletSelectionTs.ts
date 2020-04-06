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
import {Vue, Component} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
import {Password, MosaicId, Address, SimpleWallet} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel, WalletType} from '@/core/database/entities/WalletsModel'
import {DerivationService, DerivationPathLevels} from '@/services/DerivationService'
import {WalletService} from '@/services/WalletService'
import {MosaicService} from '@/services/MosaicService'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {AccountsRepository} from '@/repositories/AccountsRepository'
import {NotificationType} from '@/core/utils/NotificationType'
import {Formatters} from '@/core/utils/Formatters'

// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'

@Component({
  computed: {
    ...mapGetters({
      networkType: 'network/networkType',
      networkMosaic: 'mosaic/networkMosaic',
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
  public currentAccount: AccountsModel

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
   * Mosaic Service
   * @var {MosaicService}
   */
  public mosaicService: MosaicService

  /**
   * Wallets Repository
   * @var {WalletsRepository}
   */
  public walletsRepository: WalletsRepository

  /**
   * Accounts Repository
   * @var {AccountsRepository}
   */
  public accountsRepository: AccountsRepository

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

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  async mounted() {
    this.derivation = new DerivationService(this.$store)
    this.walletService = new WalletService(this.$store)
    this.mosaicService = new MosaicService(this.$store)
    this.walletsRepository = new WalletsRepository()
    this.accountsRepository = new AccountsRepository()

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
        this.walletsRepository.create(wallet.values)
        // set current wallet
        if (index === 0) this.$store.dispatch('wallet/SET_CURRENT_WALLET', {model: wallet})
        // add wallets to account
        this.$store.dispatch('account/ADD_WALLET', wallet)
      })

      // get wallets identifiers
      const walletIdentifiers = wallets.map(wallet => wallet.getIdentifier())

      // set known wallets
      this.$store.dispatch('wallet/SET_KNOWN_WALLETS', walletIdentifiers)

      // add wallets to account
      this.currentAccount.values.set('wallets', walletIdentifiers)
      // store account using repository
      this.accountsRepository.update(
        this.currentAccount.getIdentifier(),
        this.currentAccount.values,
      )

      // execute store actions
      this.$store.dispatch('temporary/RESET_STATE')
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      return this.$router.push({name: 'accounts.importAccount.finalize'})
    } catch(error) {
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
      this.currentAccount.values.get('networkType'),
      10,
    )

    // fetch accounts info
    const accountsInfo = await this.$store.dispatch(
      'wallet/REST_FETCH_INFOS',
      this.addressesList,
    )
    if (!accountsInfo) return
    // map balances
    this.addressMosaicMap = this.mosaicService.mapBalanceByAddress(
      accountsInfo,
      this.networkMosaic,
    )
  }

  /**
   * Create a wallet instance from mnemonic and path
   * @return {WalletsModel}
   */
  private createWalletsFromPathIndexes(indexes: number[]): WalletsModel[] {
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
      this.currentAccount.values.get('networkType'),
      paths,
    )

    const simpleWallets = accounts.map(account =>
      SimpleWallet.createFromPrivateKey(
        'SeedWallet',
        this.currentPassword,
        account.privateKey,
        this.currentAccount.values.get('networkType'),
      ))

    return simpleWallets.map((simpleWallet, i) =>
      new WalletsModel(new Map<string, any>([
        [ 'accountName', this.currentAccount.values.get('accountName') ],
        [ 'name', `Seed Account ${indexes[i] + 1}` ],
        [ 'type', WalletType.fromDescriptor('Seed') ],
        [ 'address', simpleWallet.address.plain() ],
        [ 'publicKey', accounts[i].publicKey ],
        [ 'encPrivate', simpleWallet.encryptedPrivateKey.encryptedKey ],
        [ 'encIv', simpleWallet.encryptedPrivateKey.iv ],
        [ 'path', paths[i] ],
        [ 'isMultisig', false ],
      ])))
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
