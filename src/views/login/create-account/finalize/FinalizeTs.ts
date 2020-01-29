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
import {NetworkType, SimpleWallet, Password} from 'nem2-sdk'
import {MnemonicPassPhrase} from 'nem2-hd-wallets'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {AppWallet} from '@/core/database/models/AppWallet'
import {WalletService} from '@/services/WalletService'
import {WalletsRepository} from '@/repositories/WalletsRepository'
import {NotificationType} from '@/core/utils/NotificationType'

@Component({
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    currentPassword: 'temporary/password',
    currentMnemonic: 'temporary/mnemonic',
  })},
})
export default class FinalizeTs extends Vue {
  /**
   * Currently active networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

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
   * Temporary stored password
   * @see {Store.Temporary}
   * @var {MnemonicPassPhrase}
   */
  public currentMnemonic: MnemonicPassPhrase

  /**
   * Wallet Service
   * @var {WalletService}
   */
  public walletService: WalletService

  /**
   * Wallets Repository
   * @var {WalletsRepository}
   */
  public walletsRepository: WalletsRepository

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  async mounted() {
    this.walletService = new WalletService(this.$store)
    this.walletsRepository = new WalletsRepository()
  }

  /**
   * Finalize the account creation process by adding
   * the wallet created from mnemonic pass phrase.
   * @return {void}
   */
  public submit() {
    try {
      // create account by mnemonic
      const wallet = this.createWalletFromMnemonic()

      console.log("wallet model: ", wallet.model)

      // use repository for storage
      this.walletsRepository.create(wallet.model.values)

      // execute store actions
      this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)
      this.$store.dispatch('account/ADD_WALLET', wallet.model.values.get('name'))
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet.model.values.get('name'))
      this.$store.dispatch('temporary/RESET_STATE')

      // flush and continue
      return this.$router.push({name: 'dashboard'})
    }
    catch (error) {
      throw new Error(error)
    }
  }

  /**
   * Create an AppWallet instance from mnemonic
   * @return {AppWallet}
   */
  private createWalletFromMnemonic(): AppWallet {
    const account = this.walletService.getAccountByPath(
      this.currentMnemonic,
      this.networkType,
      WalletService.DEFAULT_WALLET_PATH
    )

    console.log("account: ", account)

    const simpleWallet = SimpleWallet.createFromPrivateKey(
      'SeedWallet',
      this.currentPassword,
      account.privateKey,
      this.networkType
    )

    console.log("privateKey: ", account.privateKey)
    console.log("simpleWallet: ", simpleWallet)

    return new AppWallet(
      this.$store,
      this.currentAccount.getIdentifier(),
      'SeedWallet',
      simpleWallet,
      account.publicKey,
      WalletService.DEFAULT_WALLET_PATH,
      'Seed',
      false
    )
  }
}
