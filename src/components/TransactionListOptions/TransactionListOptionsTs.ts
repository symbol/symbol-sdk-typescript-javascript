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
import {WalletsModel} from '@/core/database/entities/WalletsModel'

// child components
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue'
import {RESTDispatcher} from '@/core/utils/RESTDispatcher'
import {MultisigService} from '@/services/MultisigService'

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
   * Selected signer from the store
   * @protected
   * @type {string}
   */
  protected selectedSigner: string = this.$store.getters['wallet/currentWallet'].values.get('publicKey')

  /**
   * Whether to show the signer selector
   * @protected
   * @type {boolean}
   */
  protected showSignerSelector: boolean = false

  /**
   * Hook called when the signer selector has changed
   * @protected
   */
  protected onSignerSelectorChange(publicKey: string): void {
    // set selected signer if the chosen account is a multisig one
    const isCosig = this.currentWallet.values.get('publicKey') !== publicKey
    const payload = !isCosig ? this.currentWallet : {
      networkType: this.networkType,
      publicKey: publicKey
    }

    // clear previous account transactions
    this.$store.dispatch('wallet/RESET_TRANSACTIONS', {model: payload})

    // dispatch actions using the rest dispatcher
    const dispatcher = new RESTDispatcher(this.$store.dispatch)
    dispatcher.add('wallet/SET_CURRENT_SIGNER', {model: payload})
    dispatcher.add('wallet/REST_FETCH_TRANSACTIONS', {
      group: this.currentTab,
      address: Address.createFromPublicKey(publicKey, this.networkType).plain(),
      pageSize: 100,
    })

    dispatcher.throttle_dispatch()
  }
  /**
   * Hook called when refresh button is clicked
   * @protected
   */
  protected refresh(): void {
    this.refreshStream$.next({publicKey: this.selectedSigner, group: this.currentTab})
  }

  /**
   * Addresses to be shown in the selector
   * @TODO: Not DRY since the same function is in FormTransactionBase
   * @readonly
   * @type {{publicKey: string, label: string}[]}
   */
  protected get signers(): {publicKey: string, label: string}[] {
    return new MultisigService(this.$store, this.$i18n).getSigners()
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

  /**
   * Hook called before the component is destroyed
   */
  beforeDestroy(): void {
    // reset the selected signer if it is not the current wallet
    this.onSignerSelectorChange(this.currentWallet.values.get('publicKey'))
  }
}
