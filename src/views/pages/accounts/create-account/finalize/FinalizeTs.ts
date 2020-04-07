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
import {NetworkType, Password} from 'symbol-sdk'
import {MnemonicPassPhrase} from 'symbol-hd-wallets'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletService} from '@/services/WalletService'
import {AccountsRepository} from '@/repositories/AccountsRepository'
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
   * @var {AccountsModel}
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
   * Accounts Repository
   * @var {AccountsRepository}
   */
  public accountsRepository: AccountsRepository

  /**
   * Hook called when the page is mounted
   * @return {void}
   */
  public mounted() {
    this.walletService = new WalletService(this.$store)
    this.walletsRepository = new WalletsRepository()
    this.accountsRepository = new AccountsRepository()
  }

  /**
   * Finalize the account creation process by adding
   * the wallet created from mnemonic pass phrase.
   * @return {void}
   */
  public async submit() {
    try {
      // create account by mnemonic
      const wallet = this.walletService.getDefaultWallet(
        this.currentAccount,
        this.currentMnemonic,
        this.currentPassword,
        this.networkType,
      )

      // execute store actions
      await this.$store.dispatch('account/ADD_WALLET', wallet)
      await this.$store.dispatch('wallet/SET_CURRENT_WALLET', {model: wallet})
      await this.$store.dispatch('wallet/SET_KNOWN_WALLETS', [wallet.getIdentifier()])
      await this.$store.dispatch('temporary/RESET_STATE')
      await this.$store.dispatch('notification/ADD_SUCCESS', NotificationType.OPERATION_SUCCESS)

      // update account in storage
      this.walletsRepository.create(wallet.values)
      this.accountsRepository.update(
        this.currentAccount.getIdentifier(),
        this.currentAccount.values,
      )

      // flush and continue
      return this.$router.push({name: 'dashboard'})
    }
    catch (error) {
      throw new Error(error)
    }
  }
}
