import {mapState} from 'vuex'
import {Component, Vue, Watch} from 'vue-property-decorator'
import {formatNumber, localRead, getPath} from '@/core/utils'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {seedWalletTitle, walletStyleSheetType} from '@/config/view/wallet.ts'
import {MultisigAccountInfo, Password} from 'nem2-sdk'
import {Message, networkConfig} from "@/config"
import TheWalletUpdate from "@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdate.vue"
import CheckPasswordDialog from '@/components/check-password-dialog/CheckPasswordDialog.vue'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'

@Component({
    components: {TheWalletDelete, TheWalletUpdate, CheckPasswordDialog},
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
    showUpdateDialog = false
    showCheckPWDialog = false
    deleteIndex = -1
    walletToDelete: AppWallet | boolean = false
    thirdTimestamp = 0
    walletStyleSheetType = walletStyleSheetType
    walletToUpdate = {}
    pathToCreate = ''
    scroll: any
    formatNumber = formatNumber

    get walletList() {
        return this.app.walletList
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    getWalletStyle(item: AppWallet): string {
        if (item.address === this.activeAddress) return walletStyleSheetType.activeWallet
        if (item.sourceType === CreateWalletType.seed) return walletStyleSheetType.seedWallet
        return walletStyleSheetType.otherWallet
    }

    get activeAddress() {
        return this.wallet.address
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get cipherMnemonic() {
        return this.app.mnemonic
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    isMultisig(address: string): boolean {
        const multisigAccountInfo: MultisigAccountInfo = this.activeAccount.multisigAccountInfo[address]
        if (!multisigAccountInfo) return false
        return multisigAccountInfo.cosignatories.length > 0
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    closeUpdateDialog() {
        this.showUpdateDialog = false
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

        const jumpedPath = seedPathList.map((element, index) => {
            if (Number(element) !== index) return index
        }).filter(x => x)

        return jumpedPath.length ? jumpedPath[0] : numberOfSeedPath
    }

    toCreate() {
        const {accountName} = this
        const walletList = JSON.parse(localRead('accountMap'))[accountName].wallets
        // get sorted path list
        const seedPathList = walletList.filter(item => item.path).map(item => item.path[item.path.length - 8]).sort()
        // check if seed wallets >= 10
        if (seedPathList.length >= networkConfig.seedWalletMaxAmount) {
            this.showErrorDialog(Message.SEED_WALLET_OVERFLOW_ERROR)
            return
        }

        const pathNumber = this.getPathNumber(seedPathList)
        this.pathToCreate = getPath(pathNumber)
        this.showCheckPWDialog = true
    }

    checkEnd(password) {
        if (!password) return
        const {accountName, pathToCreate} = this
        const currentNetType = JSON.parse(localRead('accountMap'))[accountName].currentNetType
        try {
            new AppWallet().createFromPath(
                seedWalletTitle + pathToCreate[pathToCreate.length - 8],
                new Password(password),
                pathToCreate,
                currentNetType,
                this.$store,
            )
            this.closeCheckPWDialog()
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

    mounted() {
        this.scrollToActiveWallet()
    }

    @Watch('activeAddress')
    onWalletChange() {
        this.scrollToActiveWallet()
    }
}
