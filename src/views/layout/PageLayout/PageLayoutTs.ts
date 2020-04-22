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
import {NetworkType} from 'symbol-sdk'
import {Component, Vue} from 'vue-property-decorator'
import {mapGetters} from 'vuex'
// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletService} from '@/services/WalletService'
// child components
// @ts-ignore
import AppLogo from '@/components/AppLogo/AppLogo.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import PageNavigator from '@/components/PageNavigator/PageNavigator.vue'
// @ts-ignore
import WindowControls from '@/components/WindowControls/WindowControls.vue'
// @ts-ignore
import PeerSelector from '@/components/PeerSelector/PeerSelector.vue'
// @ts-ignore
import LanguageSelector from '@/components/LanguageSelector/LanguageSelector.vue'
// @ts-ignore
import WalletSelectorField from '@/components/WalletSelectorField/WalletSelectorField.vue'
// @ts-ignore
import ModalDebugConsole from '@/views/modals/ModalDebugConsole/ModalDebugConsole.vue'
import {URLInfo} from '@/core/utils/URLInfo'

@Component({
  components: {
    AppLogo,
    ErrorTooltip,
    PageNavigator,
    WindowControls,
    PeerSelector,
    LanguageSelector,
    WalletSelectorField,
    ModalDebugConsole,
  },
  computed: {
    ...mapGetters({
      currentPeer: 'network/currentPeer',
      isConnected: 'network/isConnected',
      networkType: 'network/networkType',
      generationHash: 'network/generationHash',
      currentAccount: 'account/currentAccount',
      isCosignatoryMode: 'wallet/isCosignatoryMode',
    }),
  },
})
export class PageLayoutTs extends Vue {
  /**
   * Currently active account
   * @see {Store.Account}
   * @var {string}
   */
  public currentAccount: AccountModel

  /**
   * Currently active peer
   * @see {Store.Network}
   * @var {Object}
   */
  public currentPeer: URLInfo

  /**
   * Whether the connection is up
   * @see {Store.Network}
   * @var {boolean}
   */
  public isConnected: boolean

  /**
   * Current networkType
   * @see {Store.Network}
   * @var {NetworkType}
   */
  public networkType: NetworkType

  /**
   * Current generationHash
   * @see {Store.Network}
   * @var {string}
   */
  public generationHash: string

  /**
   * Whether cosignatory mode is active
   * @see {Store.Wallet}
   * @var {boolean}
   */
  public isCosignatoryMode: boolean

  /**
   * Whether currently displaying debug console
   * @var {boolean}
   */
  public isDisplayingDebugConsole: boolean = false

  /// region computed properties getter/setter
  /**
   * Holds alert message
   * @var {Object}
   */
  get alert(): { show: boolean, message: string } {
    if (!this.currentPeer || !this.isConnected) {
      return {show: true, message: 'Node_not_available_please_check_your_node_or_network_settings'}
    }

    if (this.currentAccount && this.currentAccount.networkType !== this.networkType) {
      return {show: true, message: 'Wallet_network_type_does_not_match_current_network_type'}
    }

    if (this.currentAccount && this.currentAccount.generationHash !== this.generationHash) {
      return {show: true, message: 'Wallet_network_type_does_not_match_current_network_type'}
    }

    return {show: false, message: ''}
  }

  get info(): { show: boolean, message: string } {
    if (this.isCosignatoryMode) {
      return {show: true, message: 'info_active_cosignatory_mode'}
    }

    return {show: false, message: ''}
  }

  get hasDebugConsoleModal(): boolean {
    return this.isDisplayingDebugConsole
  }

  set hasDebugConsoleModal(f: boolean) {
    this.isDisplayingDebugConsole = f
  }

  /// end-region computed properties getter/setter

  public async onChangeWallet(walletId: string) {
    const service = new WalletService()
    const wallet = service.getWallet(walletId)
    if (!wallet) {
      console.log('Wallet not found: ', walletId)
      return
    }

    await this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet)
  }
}
