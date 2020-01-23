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
import {NetworkType, Password, MosaicId, Address, SimpleWallet} from 'nem2-sdk'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'

// internal dependencies
import {AccountsModel} from '@/core/database/models/AppAccount'
import {WalletsModel, AppWallet} from '@/core/database/models/AppWallet'
import {DerivationService, DerivationPathLevels} from '@/services/DerivationService'
import {WalletService} from '@/services/WalletService'
import {MosaicService} from '@/services/MosaicService'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {NotificationType} from '@/core/utils/NotificationType'

// child components
// @ts-ignore
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'

// configuration
import networkConfig from  '@/../config/network.conf.json'
const networkCurrencyName = networkConfig.networks['testnet-publicTest'].currencyMosaic

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
  components: {NumberFormatting},
})
export default class WalletSelectionTs extends Vue {
  /**
   * Currently active networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType
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
  public currentMnemonic: MnemonicPassPhrase

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
    if (! this.selectedAccounts.length) {
      return this.$store.dispatch(
        'notification/ADD_ERROR',
        NotificationType.INPUT_EMPTY_ERROR
      )
    }

    try {
      // selected accounts must be imported to storage
      this.selectedAccounts.map((index, cnt) => {
        const wallet = this.createWalletFromPathIndex(index)

        // use repository for storage
        this.walletsRepository.create(wallet.model.values)

        // set first wallet active
        if (cnt === 0) {
          this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet.model.values.get('name'))
        }

        // add wallet to account
        this.$store.dispatch('account/ADD_WALLET', wallet.model.values.get('name'))
      })

      // execute store actions
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$store.dispatch('temporary/RESET_STATE')
      return this.$router.push({name: 'login.importAccount.finalize'})
    }
    catch(error) {
      return this.$store.dispatch(
        'notification/ADD_ERROR',
        error
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
      this.currentMnemonic,
      this.networkType,
      WalletService.DEFAULT_WALLET_PATH,
      10
    )

    // fetch accounts info
    const accountsInfo = await this.$store.dispatch(
      'wallet/REST_FETCH_INFOS',
      this.addressesList
    )

    // map balances
    this.addressMosaicMap = this.mosaicService.mapBalanceByAddress(
      accountsInfo,
      this.networkMosaic
    )
  }

  /**
   * Create an AppWallet instance from mnemonic and path
   * @return {AppWallet}
   */
  private createWalletFromPathIndex(index: number): AppWallet {
    const path = this.derivation.incrementPathLevel(
      WalletService.DEFAULT_WALLET_PATH,
      DerivationPathLevels.Account,
      index
    )

    const account = this.walletService.getAccountByPath(
      this.currentMnemonic,
      this.networkType,
      path
    )

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      'SeedWallet',
      this.currentPassword,
      account.privateKey,
      this.networkType
    )

    return new AppWallet(
      this.$store,
      'SeedWallet',
      simpleWallet,
      account.publicKey,
      WalletService.DEFAULT_WALLET_PATH,
      'Seed',
      false
    )
  }
}
