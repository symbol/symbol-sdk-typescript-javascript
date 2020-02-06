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
import {Mosaic, MosaicId} from 'nem2-sdk'

// internal dependencies
import {WalletsModel} from '@/core/database/entities/WalletsModel'
import {AppWallet, AppWalletType} from '@/core/database/models/AppWallet'
import {WalletService} from '@/services/WalletService'

// child components
// @ts-ignore
import AmountDisplay from '@/components/AmountDisplay/AmountDisplay.vue'
// @ts-ignore
import ModalMnemonicBackupWizard from '@/views/modals/ModalMnemonicBackupWizard/ModalMnemonicBackupWizard.vue'

@Component({
  components: {
    AmountDisplay,
    ModalMnemonicBackupWizard,
  }, 
  computed: {...mapGetters({
    currentWallet: 'wallet/currentWallet',
    knownWallets: 'wallet/knownWallets',
    currentWalletMosaics: 'wallet/currentWalletMosaics',
    networkMosaic: 'mosaic/networkMosaic',
    networkMosaicTicker: 'mosaic/networkMosaicTicker',
  })}})
export class WalletSelectorPanelTs extends Vue {
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
   * Currently active wallet's balances
   * @var {Mosaic[]}
   */
  public currentWalletMosaics: Mosaic[]

  /**
   * Networks currency mosaic
   * @var {MosaicId}
   */
  public networkMosaic: MosaicId

  /**
   * Currency mosaic's ticker
   * @var {string}
   */
  public networkMosaicTicker: string

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
   * Hook called when the component is created
   * @return {void}
   */
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
      ({identifier, values}) => ({
        identifier,
        name: values.get('name'),
        type: values.get('type'),
        isMultisig: values.get('isMultisig')
      }),
    )
  }

  public get networkMosaicBalance() {
    if (! this.currentWallet || ! this.currentWalletMosaics.length) {
      return 0
    }

    // search for network mosaic
    const entry = this.currentWalletMosaics.filter(
      mosaic => mosaic.id.equals(this.networkMosaic)
    )

    return entry.length === 1 ? entry.shift().amount.compact() : 0
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
    return item.type === AppWalletType.SEED
  }

  /**
   * Hook called when the delete button of a wallet is clicked
   * @param item 
   */
  public onClickDelete(item) {
    this.clickedWallet = item
  }
}


/*
import {mapState} from 'vuex'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {formatNumber} from '@/core/utils'
import {AppWallet, AppInfo, StoreAccount, Notice, NoticeType} from '@/core/model'
import {CreateWalletType} from '@/core/model/CreateWalletType'
import {walletStyleSheetType} from '@/config/view/wallet.ts'
import {MultisigAccountInfo} from 'nem2-sdk'
import TheWalletAdd from '@/views/wallet/wallet-switch/the-wallet-add/TheWalletAdd.vue'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import MnemonicDialog from '@/views/wallet/wallet-details/mnemonic-dialog/MnemonicDialog.vue'
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'
import {BalancesService} from '@/core/services'

@Component({
  components: {
    TheWalletDelete,
    MnemonicDialog,
    TheWalletAdd,
    NumberFormatting,
  },
  computed: {
    ...mapState({
      activeAccount: 'account',
      app: 'app',
    }),
  },
})
export class WalletSwitchTs extends Vue {
  app: AppInfo
  activeAccount: StoreAccount
  showDeleteDialog = false
  showWalletAdd = false
  walletToDelete: AppWallet | boolean = false
  walletStyleSheetType = walletStyleSheetType
  formatNumber = formatNumber
  showMnemonicDialog = false

  get walletList() {
    return this.app.walletList
  }

  get wallet() {
    return this.activeAccount.wallet
  }

  get activeAddress() {
    return this.wallet.address
  }

  get networkCurrency() {
    return this.activeAccount.networkCurrency
  }

  getBalanceFromAddress(wallet: AppWallet): string {
    return BalancesService.getBalanceFromAddress(wallet, this.$store)
  }

  getWalletStyle(item: AppWallet): string {
    if (item.address === this.activeAddress) return walletStyleSheetType.activeWallet
    if (item.sourceType === CreateWalletType.seed) return walletStyleSheetType.seedWallet
    return walletStyleSheetType.otherWallet
  }

  // @AppWallet: should be an AppWallet computed property
  isMultisig(address: string): boolean {
    const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[address]
    if (!multisigAccountInfo) return false
    return multisigAccountInfo.cosignatories.length > 0
  }

  switchWallet(newActiveWalletAddress) {
    const newActiveWallet = this.walletList.find(({address}) => address === newActiveWalletAddress)
    this.$store.commit('SET_WALLET', newActiveWallet)
  }

  scrollToActiveWallet() {
    const currentWalletIndex = this.walletList
      .findIndex(({address}) => address === this.activeAddress)
    if(!this.$refs.walletsDiv[currentWalletIndex]) return
    const offsetTop = this.$refs.walletsDiv[currentWalletIndex]['offsetTop']
    this.$refs.walletScroll['scrollTop'] = offsetTop - offsetTop / currentWalletIndex
  }

  deleteWallet(walletToDelete) {
    this.walletToDelete = walletToDelete
    this.showDeleteDialog = true
  }

  displayMnemonicDialog() {
    if (!this.wallet.encryptedMnemonic) {
      Notice.trigger('this.$t(\'no_mnemonic\')', NoticeType.error, this.$store)
      return
    }

    this.showMnemonicDialog = true
  }

  @Watch('activeAddress')
  onWalletChange() {
    Vue.nextTick().then(() => {
      this.scrollToActiveWallet()
    })
  }

  mounted() {
    this.scrollToActiveWallet()
  }
}

*/