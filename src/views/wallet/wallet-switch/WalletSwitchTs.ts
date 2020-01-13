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
