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
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {WalletsRepository} from '@/repositories/WalletsRepository'

@Component({computed: {...mapGetters({
  currentWallet: 'wallet/currentWallet',
  knownWallets: 'wallet/knownWallets',
})}})
export class WalletSelectorTs extends Vue {
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
  public knownWallets: WalletsRepository

/// region computed properties getter/setter
  get currentWalletIdentifier(): string {
    return !this.currentWallet ? '' : {...this.currentWallet}.identifier
  }

  set currentWalletIdentifier(identifier: string) {
    this.$store.dispatch('wallet/SET_CURRENT_WALLET', identifier)
  }

  get currentWallets(): {identifier: string, name: string}[] {
    return [...this.knownWallets.entries()].map(
      ([ identifier, {values}]) => ({identifier, name: values.get('name')}),
    )
  }
/// end-region computed properties getter/setter
}
