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
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {WalletService} from '@/services/WalletService'

// child components
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'
// @ts-ignore
import WalletSelectorPanel from '@/components/WalletSelectorPanel/WalletSelectorPanel.vue'
// @ts-ignore
import WalletDetails from '@/components/WalletDetails/WalletDetails.vue'
// @ts-ignore
import WalletActions from '@/components/WalletActions/WalletActions.vue'


@Component({
  components: {
    NavigationTabs,
    WalletSelectorPanel,
    WalletDetails,
    WalletActions,
  },
  computed: {...mapGetters({
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
  })}
})
export class WalletsTs extends Vue {
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

  /**
   * Argument passed to the navigation component
   * @var {string}
   */
  public parentRouteName: string = 'wallets'

  public created() {
    this.service = new WalletService(this.$store)
  }
}
