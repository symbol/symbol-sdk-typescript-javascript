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

// internal dependencies
import {AccountsModel} from '@/core/database/models/AppAccount'
import {WalletsModel} from '@/core/database/models/AppWallet'
import {WalletsRepository} from '@/repositories/WalletsRepository'

@Component({computed: {...mapGetters({
  currentAccount: 'account/currentAccount',
  currentWallet: 'wallet/currentWallet',
})}})
export class WalletSelectorTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {AccountsModel}
   */
  public currentAccount: AccountsModel

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Wallets repository
   * @var {WalletsRepository}
   */
  public wallets: WalletsRepository

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  mounted() {
    this.wallets = new WalletsRepository()
  }

/// region computed properties getter/setter
  get currentWalletName(): string {
    return !this.currentWallet ? '' : this.currentWallet.values.get("name")
  }

  set currentWalletName(name: string) {
    this.$store.dispatch('wallet/SET_CURRENT_WALLET', name)

    // update inner state
    this.currentWallet = this.wallets.read(name)
  }
/// end-region computed properties getter/setter
}
