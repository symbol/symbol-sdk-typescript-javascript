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
// external dependencies
import {mapGetters} from 'vuex'
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {MultisigAccountInfo, NetworkType, Address} from 'symbol-sdk'
import {asyncScheduler, Subject} from 'rxjs'
import {throttleTime} from 'rxjs/operators'

// internal dependencies
import {WalletService} from '@/services/WalletService'
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'

/**
// To implement for confirmed and unconfirmed tx:
- state 0 : "link 'View other accounts'"
- state 1 = clicked : "selector with known wallets"
- state 2 = selected : "changes address used"
*/

// custom types
type group = 'confirmed' | 'unconfirmed' | 'partial'

@Component({
  components: {SignerSelector},
  computed: {
    ...mapGetters({
      currentWallet: 'wallet/currentWallet',
      currentWalletMultisigInfo: 'wallet/currentWalletMultisigInfo',
      networkType: 'network/networkType',
    })
  }
})
export class TransactionListOptionsTs extends Vue {
  @Prop({default: 'confirmed'}) currentTab: group

  /**
   * Minimum interval in ms between each refresh call
   * @private
   * @type {number}
   */
  private REFRESH_CALLS_THROTTLING: number = 500

  /**
   * Observable of public keys to fetch for 
   *
   * @private
   * @type {Observable<string>}
   */
  private refreshStream$: Subject<{publicKey: string, group: group}> = new Subject

  /**
   * Currently active wallet
   * @var {WalletsModel}
   */
  protected currentWallet: WalletsModel

  /**
   * Current wallet multisig info
   * @type {MultisigAccountInfo}
   */
  protected currentWalletMultisigInfo: MultisigAccountInfo

  /**
 * Network type
 * @var {NetworkType}
 */
  protected networkType: NetworkType

  /**
   * Selected signer
   * @protected
   * @type {string}
   */
  protected selectedSigner: string = this.$store.getters['wallet/currentWallet'].values.get('publicKey')

  /**
   * Hook called when refresh button is clicked
   * @protected
   */
  protected refresh(): void {
    // @TODO: add support for confirmed and unconfirmed
    if (this.currentTab !== 'partial') return

    // push a new refresh request to the stream
    this.refreshStream$.next({publicKey: this.selectedSigner, group: this.currentTab})
  }


  /**
   * Addresses to be shown in the selector
   * @TODO: Not DRY since the same function is in FormTransactionBase
   * @readonly
   * @type {{publicKey: string, label: string}[]}
   */
  protected get signers(): {publicKey: string, label: string}[] {
    if (!this.currentWallet) return []

    const self = [
      {
        publicKey: this.currentWallet.values.get('publicKey'),
        label: this.currentWallet.values.get('name'),
      },
    ]

    const multisigInfo = this.currentWalletMultisigInfo
    if (!multisigInfo) return self

    // in case "self" is a multi-signature account
    if (multisigInfo && multisigInfo.isMultisig()) {
      self[0].label = self[0].label + this.$t('label_postfix_multisig')
    }

    // add multisig accounts of which "self" is a cosignatory
    if (multisigInfo) {
      const service = new WalletService(this.$store)
      return self.concat(...multisigInfo.multisigAccounts.map(
        ({publicKey}) => ({
          publicKey,
          label: service.getWalletLabel(publicKey, this.networkType) + this.$t('label_postfix_multisig'),
        })))
    }

    return self
  }

  /**
   * Hook called @ component creation
   * Starts a subscription to handle REST calls for refreshing transactions
   */
  public created(): void {
    this.refreshStream$
      .pipe(
        throttleTime(this.REFRESH_CALLS_THROTTLING, asyncScheduler, {leading: true, trailing: true}),
      )
      .subscribe(({publicKey, group}) => {
        // dispatch REST call
        this.$store.dispatch('wallet/REST_FETCH_TRANSACTIONS', {
          group,
          address: Address.createFromPublicKey(publicKey, this.networkType).plain(),
          pageSize: 100,
        })
      })
  }

  /**
   * Watch for currentWallet changes
   * Necessary to set the default signer in the selector 
   * @param {*} newCurrentWallet
   */
  @Watch('currentWallet')
  onCurrentWalletChange(newCurrentWallet: WalletsModel): void {
    this.selectedSigner = newCurrentWallet.values.get('publicKey')
  }
}
