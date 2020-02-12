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
import {WalletService} from '@/services/WalletService'

@Component({computed: {...mapGetters({
  currentWallet: 'wallet/currentWallet',
  knownWallets: 'wallet/knownWallets',
})}})
export class WalletSelectorFieldTs extends Vue {
  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: string[]

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public service: WalletService

  public created() {
    this.service = new WalletService(this.$store)
  }

/// region computed properties getter/setter
  public get currentWalletIdentifier(): string {
    return !this.currentWallet ? '' : {...this.currentWallet}.identifier
  }

  public set currentWalletIdentifier(identifier: string) {
    if (!identifier || !identifier.length) {
      return ;
    }

    const wallet = this.service.getWallet(identifier)
    if (!wallet) {
      return ;
    }

    this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet)
    this.$emit('change', wallet.getIdentifier())
  }

  public get currentWallets(): {identifier: string, name: string}[] {
    if (!this.knownWallets || !this.knownWallets.length) {
      return []
    }

    // filter wallets to only known wallet names
    const knownWallets = this.service.getWallets(
      (e) => this.knownWallets.includes(e.getIdentifier())
    )

    return [...knownWallets].map(
      ({identifier, values}) => ({identifier, name: values.get('name')}),
    )
  }
/// end-region computed properties getter/setter
}
