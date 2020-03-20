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

// child components
// @ts-ignore
import WalletNameDisplay from '@/components/WalletNameDisplay/WalletNameDisplay.vue'
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue'
// @ts-ignore
import ImportanceScoreDisplay from '@/components/ImportanceScoreDisplay/ImportanceScoreDisplay.vue'
// @ts-ignore
import WalletContactQR from '@/components/WalletContactQR/WalletContactQR.vue'
// @ts-ignore
import WalletAddressDisplay from '@/components/WalletAddressDisplay/WalletAddressDisplay.vue'
// @ts-ignore
import WalletPublicKeyDisplay from '@/components/WalletPublicKeyDisplay/WalletPublicKeyDisplay.vue'
// @ts-ignore
import WalletActions from '@/components/WalletActions/WalletActions.vue'
// @ts-ignore
import WalletLinks from '@/components/WalletLinks/WalletLinks.vue'
// @ts-ignore
import WalletAliasDisplay from '@/components/WalletAliasDisplay/WalletAliasDisplay.vue'

@Component({
  components: {
    WalletNameDisplay,
    ProtectedPrivateKeyDisplay,
    ImportanceScoreDisplay,
    WalletContactQR,
    WalletActions,
    WalletLinks,
    WalletAddressDisplay,
    WalletPublicKeyDisplay,
    WalletAliasDisplay,
  },
  computed: {...mapGetters({
    defaultWallet: 'app/defaultWallet',
    currentWallet: 'wallet/currentWallet',
  })},
})
export class WalletDetailsPageTs extends Vue {
  /**
   * Default wallet
   * @see {Store.Wallet}
   * @var {string}
   */
  public defaultWallet: string

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletsModel}
   */
  public currentWallet: WalletsModel

  /**
   * Name form visibility
   * @type {boolean}
   */
  hasNameForm: boolean = false
/// region computed properties getter/setter
/// end-region computed properties getter/setter

  /**
   * Whether the wallet item is a seed wallet
   * @param item
   * @return {boolean}
   */
  public isSeedWallet(wallet: WalletsModel): boolean {
    return wallet.values.get('seed') && wallet.values.get('seed').length
  }
}
