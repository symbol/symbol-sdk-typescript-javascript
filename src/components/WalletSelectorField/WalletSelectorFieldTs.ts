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
import {Component, Prop, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
import {WalletModel} from '@/core/database/entities/WalletModel'
import {WalletService} from '@/services/WalletService'

@Component({
  computed: {
    ...mapGetters({
      currentWallet: 'wallet/currentWallet',
      knownWallets: 'wallet/knownWallets',
    }),
  },
})
export class WalletSelectorFieldTs extends Vue {
  @Prop({
    default: null,
  }) value: string

  @Prop({
    default: false,
  }) defaultFormStyle: boolean

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletModel}
   */
  public currentWallet: WalletModel

  /**
   * Known wallets
   */
  public knownWallets: WalletModel[]

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public readonly walletService: WalletService = new WalletService()


  /// region computed properties getter/setter
  public get currentWalletIdentifier(): string {
    if (this.value) return this.value

    if (this.currentWallet) {
      return this.currentWallet.id
    }

    // fallback value
    return ''
  }

  public set currentWalletIdentifier(id: string) {
    if (!id || !id.length) return

    this.$emit('input', id)

    const wallet = this.walletService.getWallet(id)
    if (!wallet) return
  }

  public get currentWallets(): WalletModel[] {
    return this.knownWallets
  }

/// end-region computed properties getter/setter
}
