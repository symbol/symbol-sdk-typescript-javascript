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
import {MosaicId, NetworkType, AccountInfo, Address} from 'symbol-sdk'
import {ValidationProvider} from 'vee-validate'

// internal dependencies
import {AccountsModel} from '@/core/database/entities/AccountsModel'
import {WalletsModel, WalletType} from '@/core/database/entities/WalletsModel'
import {WalletService} from '@/services/WalletService'
import {MosaicService} from '@/services/MosaicService'
import {ValidationRuleset} from '@/core/validation/ValidationRuleset'
import {WalletsRepository} from '@/repositories/WalletsRepository'

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

@Component({
  components: {
    MosaicAmountDisplay,
    ModalFormSubWalletCreation,
    ErrorTooltip,
    FormLabel,
    ValidationProvider,
    ModalMnemonicExport,
  }, 
  computed: {...mapGetters({
    networkType: 'network/networkType',
    currentAccount: 'account/currentAccount',
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
    currentWallets: 'wallet/currentWallets',
    knownWalletsInfo: 'wallet/knownWalletsInfo',
    networkMosaic: 'mosaic/networkMosaic',
  })}})
export class WalletSelectorPanelTs extends Vue {
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
   * Known wallets identifiers
   * @var {string[]}
   */
  public knownWallets: string[]

  /**
   * current wallets identifiers
   * @var {string[]}
   */
  public currentWallets: string[]

  /**
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public knownWalletsInfo: AccountInfo[]

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Wallets repository
   * @var {WalletService}
   */
  public service: WalletService

  /**
   * Temporary storage of clicked wallets
   * @var {WalletsModel}
   */
  public clickedWallet: WalletsModel

  /**
   * Whether user is currently adding a wallet (modal)
   * @var {boolean}
   */
  public isAddingWallet: boolean = false/**
  * Whether currently viewing export
  * @var {boolean}
  */
  public isViewingExportModal: boolean = false

  /**
   * Validation rules
   * @var {ValidationRuleset}
   */
  public validationRules = ValidationRuleset

  public addressesBalances: any = {}

  /**
   * the toggle of the Spin
   * @type string
   */
  public isLoading: boolean = true

  /**
   * Hook called when the component is created
   * @return {void}
   */
  public async created() {
    this.service = new WalletService(this.$store)
    const mosaicService = new MosaicService(this.$store)

    // - read known addresses
    const repository = new WalletsRepository()
    const addresses = Array.from(repository.entries(
      (w: WalletsModel) => this.knownWallets.includes(w.getIdentifier()),
    ).values()).map(w => Address.createFromRawAddress(w.values.get('address')))

    // - fetch latest accounts infos (1 request)
    const knownWalletsInfo = await this.$store.dispatch('wallet/REST_FETCH_INFOS', addresses)

    // - filter available wallets info
    const knownWallets = knownWalletsInfo.filter(
      info => {
        const wallet = Array.from(repository.entries(
          (w: WalletsModel) => info.address.plain() === w.values.get('address'),
        ).values())

        return wallet.length > 0
      })

    if (!knownWallets.length) {
      this.isLoading = false
    }

    // - format balances
    for (let i = 0, m = knownWallets.length; i < m; i ++) {
      const currentInfo = knownWallets[i]

      // read info and balance
      const address = currentInfo.address.plain()
      const netBalance = currentInfo.mosaics.find(m => m.id.equals(this.networkMosaic))
      if(netBalance){
        // store relative balance
        const balance = await mosaicService.getRelativeAmount(
          {...netBalance}.amount.compact(),
          this.networkMosaic,
        )

        Vue.set(this.addressesBalances, address, balance)
      }
      // remove spin
      this.isLoading = false
    }
  }

  /// region computed properties getter/setter
  public get balances(): any {
    return this.addressesBalances
  }

  public get currentWalletIdentifier(): string {
    return !this.currentWallet ? '' : {...this.currentWallet}.identifier
  }

  public set currentWalletIdentifier(identifier: string) {
    if (!identifier || !identifier.length) {
      return 
    }

    const wallet = this.service.getWallet(identifier)
    if (!wallet) {
      return 
    }

    if (!this.currentWallet || identifier !== this.currentWallet.getIdentifier()) {
      this.$store.dispatch('wallet/SET_CURRENT_WALLET', {model: wallet})
      this.$emit('input', wallet.getIdentifier())
    }
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
    return item.identifier === this.currentWallet.getIdentifier()
  }

  /**
   * Whether the wallet item is a seed wallet
   * @param item
   * @return {boolean}
   */
  public isSeedWallet(item): boolean {
    return item.type === WalletType.SEED
  }

  public getBalance(item): number {
    return this.addressesBalances[item.address]
  }
}
