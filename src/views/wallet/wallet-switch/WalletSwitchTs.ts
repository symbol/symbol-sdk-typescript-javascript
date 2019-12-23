import {mapState} from 'vuex'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {formatNumber, localRead} from '@/core/utils'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {seedWalletTitle, walletStyleSheetType} from '@/config/view/wallet.ts'
import {MultisigAccountInfo, Password} from 'nem2-sdk'
import {Message, networkConfig} from "@/config"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import MnemonicDialog from '@/views/wallet/wallet-details/mnemonic-dialog/MnemonicDialog.vue'
import NumberFormatting from '@/components/number-formatting/NumberFormatting.vue'

@Component({
    components: {
        TheWalletDelete,
        MnemonicDialog,
        CheckPasswordDialog,
        NumberFormatting
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class WalletSwitchTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    showDeleteDialog = false
    showCheckPWDialog = false
    walletToDelete: AppWallet | boolean = false
    walletStyleSheetType = walletStyleSheetType
    pathToCreate = 0
    scroll: any
    formatNumber = formatNumber
    isShowMnemonicDialog = false

    get walletList() {
        return this.app.walletList
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get activeAddress() {
        return this.wallet.address
    }

    get currentAccount() {
        return this.activeAccount.currentAccount
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    getWalletStyle(item: AppWallet): string {
        if (item.address === this.activeAddress) return walletStyleSheetType.activeWallet
        if (item.sourceType === CreateWalletType.seed) return walletStyleSheetType.seedWallet
        return walletStyleSheetType.otherWallet
    }

    isMultisig(address: string): boolean {
        const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[address]
        if (!multisigAccountInfo) return false
        return multisigAccountInfo.cosignatories.length > 0
    }

    closeDeleteDialog() {
        this.showDeleteDialog = false
    }

    switchWallet(newActiveWalletAddress) {
        AppWallet.updateActiveWalletAddress(newActiveWalletAddress, this.$store)
    }

    toImport() {
        this.$emit('toImport')
    }

    showErrorDialog(text) {
        this.$Notice.destroy()
        this.$Notice.error({
            title: this.$t(text) + ''
        })
    }

    getPathNumber(seedPathList: string[]): number {
        const numberOfSeedPath = seedPathList.length
        if (!numberOfSeedPath) return 0

        const jumpedPath = seedPathList
            .map(a => Number(a))
            .sort()
            .map((element, index) => {
                if (element !== index) return index
            })
            .filter(x => x !== undefined)

        return jumpedPath.length ? jumpedPath[0] : numberOfSeedPath
    }

    toCreate() {
        const {currentAccount} = this
        const walletList = JSON.parse(localRead('accountMap'))[currentAccount.name].wallets
        // get sorted path list
        const seedPathList = walletList.filter(item => item.path).map(item => item.path[item.path.length - 8]).sort()
        // check if seed wallets >= 10
        if (seedPathList.length >= networkConfig.seedWalletMaxAmount) {
            this.showErrorDialog(Message.SEED_WALLET_OVERFLOW_ERROR)
            return
        }

        this.pathToCreate = this.getPathNumber(seedPathList)
        this.showCheckPWDialog = true
    }

    passwordValidated(password) {
        if (!password) return
        const {pathToCreate, currentAccount} = this
        const networkType = currentAccount.networkType
        try {
            new AppWallet().createFromPath(
                seedWalletTitle + pathToCreate,
                new Password(password),
                pathToCreate,
                networkType,
                this.$store,
            )
        } catch (error) {
            throw new Error(error)
        }
    }

    scrollToActiveWallet() {
        // scroll to current wallet
        const currentWalletIndex = this.walletList
            .findIndex(({address}) => address === this.activeAddress)
        this.$refs.walletScroll["scrollTop"] = this.$refs.walletsDiv[currentWalletIndex]['offsetTop'] - 180
    }


    deleteWallet(walletToDelete) {
        this.walletToDelete = walletToDelete
        this.showDeleteDialog = true
    }

    // @WALLETS refactor
    changeMnemonicDialog() {
        if (!this.wallet.encryptedMnemonic) {
            this.$Notice.warning({
                title: this.$t('no_mnemonic') + ''
            })
            return
        }
        this.isShowMnemonicDialog = true
    }

    @Watch('activeAddress')
    onWalletChange() {
        this.scrollToActiveWallet()
    }
    mounted() {
      this.scrollToActiveWallet()
    }

}
