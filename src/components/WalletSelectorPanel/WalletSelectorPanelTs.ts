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
import {MosaicId, NetworkType} from 'symbol-sdk'
import {ValidationProvider} from 'vee-validate'
// internal dependencies
import {AccountModel} from '@/core/database/entities/AccountModel'
import {WalletModel} from '@/core/database/entities/WalletModel'
import {WalletService} from '@/services/WalletService'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
// child components
// @ts-ignore
import MosaicAmountDisplay from '@/components/MosaicAmountDisplay/MosaicAmountDisplay.vue'
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue'
// @ts-ignore
import FormLabel from '@/components/FormLabel/FormLabel.vue'
// @ts-ignore
import ModalFormSubWalletCreation from '@/views/modals/ModalFormSubWalletCreation/ModalFormSubWalletCreation.vue'
// @ts-ignore
import ModalMnemonicExport from '@/views/modals/ModalMnemonicExport/ModalMnemonicExport.vue'
import {NetworkCurrencyModel} from '@/core/database/entities/NetworkCurrencyModel'
import {MosaicModel} from '@/core/database/entities/MosaicModel'

@Component({
  components: {
    MosaicAmountDisplay,
    ModalFormSubWalletCreation,
    ErrorTooltip,
    FormLabel,
    ValidationProvider,
    ModalMnemonicExport,
  },
  computed: {
    ...mapGetters({
      currentAccount: 'account/currentAccount',
      currentWallet: 'wallet/currentWallet',
      knownWallets: 'wallet/knownWallets',
      networkType: 'network/networkType',
      mosaics: 'mosaic/mosaics',
      networkMosaic: 'mosaic/networkMosaic',
      networkCurrency: 'mosaic/networkCurrency',
    }),
  },
})
export class WalletSelectorPanelTs extends Vue {

  /**
   * The network currency.
   */
  public networkCurrency: NetworkCurrencyModel

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
  public currentAccount: AccountModel

  /**
   * Currently active wallet
   * @see {Store.Wallet}
   * @var {WalletModel}
   */
  public currentWallet: WalletModel

  /**
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: WalletModel[]
  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Current wallet owned mosaics
   * @private
   * @type {MosaicInfo[]}
   */
  private mosaics: MosaicModel[]

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public walletService: WalletService

  /**
   * Whether user is currently adding a wallet (modal)
   * @var {boolean}
   */
  public isAddingWallet: boolean = false
  /**
   * Whether currently viewing export
   * @var {boolean}
   */
  public isViewingExportModal: boolean = false

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset


  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created() {
    this.walletService = new WalletService()
  }

  /// region computed properties getter/setter
  public get balances(): Map<string, number> {
    const networkMosaics = this.mosaics.filter(m => m.mosaicIdHex === this.networkMosaic.toHex())
    return Object.assign({}, ...networkMosaics.map(s => ({[s.addressRawPlain]: s.balance})))
    // return this.addressesBalances
  }

  public get currentWalletIdentifier(): string {
    return !this.currentWallet ? '' : this.currentWallet.id
  }

  public set currentWalletIdentifier(id: string) {
    if (!id || !id.length) {
      return
    }

    const wallet = this.walletService.getWallet(id)
    if (!wallet) {
      return
    }

    if (!this.currentWallet || id !== this.currentWallet.id) {
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', wallet)
      this.$emit('input', wallet.id)
    }
  }

  public get currentWallets(): WalletModel[] {
    return this.knownWallets
  }

  public get hasAddWalletModal(): boolean {
    return this.isAddingWallet
  }

  public set hasAddWalletModal(f: boolean) {
    this.isAddingWallet = f
  }

  public get hasMnemonicExportModal(): boolean {
    return this.isViewingExportModal
  }

  public set hasMnemonicExportModal(f: boolean) {
    this.isViewingExportModal = f
  }

  /// end-region computed properties getter/setter

  /**
   * Whether the wallet item is the current wallet
   * @param item
   * @return {boolean}
   */
  public isActiveWallet(item): boolean {
    return item.id === this.currentWallet.id
  }
}
