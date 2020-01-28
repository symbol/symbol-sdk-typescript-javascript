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
import {MultisigAccountInfo, PublicAccount, NetworkType} from 'nem2-sdk'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {WalletService} from '@/services/WalletService'

@Component({computed: {...mapGetters({
  networkType: 'network/networkType',
  currentAccount: 'account/currentAccount',
  currentWallet: 'wallet/currentWallet',
  knownWallets: 'wallet/knownWallets',
  multisigInfo: 'wallet/currentMultisigInfo',
})}})
export class SignerSelectorTs extends Vue {

  @Prop({
    default: ''
  }) value: string

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
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Active account's wallets
   * @see {Store.Wallet}
   * @var {WalletsModel[]}
   */
  public knownWallets: WalletsModel[]

  /**
   * Active wallet's multisig info
   * @see {Store.Wallet}
   * @var {MultisigAccountInfo}
   */
  public multisigInfo: MultisigAccountInfo

  /**
   * Wallet service
   * @var {WalletService}
   */
  public walletService: WalletService

  /**
   * Hook called when the component is mounted
   * @return {void}
   */
  public async mounted() {
    this.walletService = new WalletService(this.$store)

    if (this.currentWallet) {
      const address = this.currentWallet.address().plain()
      await this.$store.dispatch('wallet/REST_FETCH_MULTISIG', address)
    }
  }

/// region computed properties getter/setter
  public get signers(): {publicKey: string, label: string}[] {
    if (! this.currentWallet) {
      return []
    }

    // "self"
    const currentSigner = PublicAccount.createFromPublicKey(
      this.currentWallet.values.get('publicKey'),
      this.networkType
    )

    // add multisig accounts
    return [
      {
        publicKey: currentSigner.publicKey,
        label: this.walletService.getWalletLabel(currentSigner.publicKey, this.networkType)
      },
      ...this.multisigInfo.multisigAccounts.map(
        ({publicKey}) => ({
          publicKey,
          label: this.walletService.getWalletLabel(publicKey, this.networkType)
        }))
    ]
  }
/// end-region computed properties getter/setter
}
