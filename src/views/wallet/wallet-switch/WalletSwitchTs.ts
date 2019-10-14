import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import {formatNumber, formatXemAmount, localRead} from '@/core/utils/utils.ts'
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {walletStyleSheetType} from '@/config/view/wallet.ts'
import {MultisigAccountInfo, Password} from 'nem2-sdk'
import TheWalletUpdate from "@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdate.vue"
import {Message, networkConfig} from "@/config"
import CheckPasswordDialog from '@/common/vue/check-password-dialog/CheckPasswordDialog.vue'

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

    formatNumber(number) {
        return formatNumber(number)
    }

    formatXemAmount(text) {
        return formatXemAmount(text)
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

    toCreate() {
        const {accountName} = this
        const walletList = JSON.parse(localRead('accountMap'))[accountName].wallets
        // get sorted path list
        const seedPathList = walletList.filter(item => item.path).map(item => item.path[item.path.length - 2]).sort()
        // check if seed wallets > 10
        console.log(seedPathList)
        if (seedPathList.length > networkConfig.seedWalletMaxAmount) {
            this.showErrorDialog(Message.SEED_WALLET_OVERFLOW_ERROR)
            return
        }
        //get min path to create
        let pathToCreate = '0'
        // check if there is a jump number
        const flag = seedPathList.every((item, index) => {
            if (item == index) return true
            pathToCreate = `${index}`
            return false
        })
        pathToCreate = flag ? seedPathList.length : pathToCreate
        this.pathToCreate = `m/44'/43'/0'/0'/${pathToCreate}'`
        this.showCheckPWDialog = true
    }

    checkEnd(password) {
        if (!password) return
        const {accountName, pathToCreate, cipherMnemonic} = this
        const currentNetType = JSON.parse(localRead('accountMap'))[accountName].currentNetType
        try {
            new AppWallet().createFromPath(
                'seedWallet-' + pathToCreate[pathToCreate.length - 2],
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

    mounted() {
        // scroll to current wallet
        this.$refs.walletScroll["scrollTop"] = this.walletList
            .findIndex(({address}) => address === this.activeAddress) * 40
    }
}
