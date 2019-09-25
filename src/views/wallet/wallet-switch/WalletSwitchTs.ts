import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import TheWalletDelete from '@/views/wallet/wallet-switch/the-wallet-delete/TheWalletDelete.vue'
import {formatXEMamount, formatNumber, localRead} from '@/core/utils/utils.ts'
import {AppWallet} from "@/core/model"
import {CreateWalletType} from "@/core/model/CreateWalletType"
import {walletStyleSheetType} from '@/config/view/wallet.ts'
import TheWalletUpdate from "@/views/wallet/wallet-switch/the-wallet-update/TheWalletUpdate.vue"
@Component({
    components: {TheWalletDelete, TheWalletUpdate},
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class WalletSwitchTs extends Vue {
    app: any
    activeAccount: any
    showCheckPWDialog = false
    deleteIndex = -1
    deletecurrent = -1
    walletToDelete: AppWallet | boolean = false
    thirdTimestamp = 0
    walletStyleSheetType = walletStyleSheetType

    get walletList() {
        let {walletList} = this.app
        walletList.sort((a, b) => {
            return b.createTimestamp - a.createTimestamp
        })
        return walletList.map(item => {
            const walletType = item.accountTitle.substring(0, item.accountTitle.indexOf('-'))
            switch (walletType) {
                case CreateWalletType.keyStore:
                case CreateWalletType.privateKey:
                    item.stylesheet = walletStyleSheetType.otherWallet
                    break
                case CreateWalletType.seed:
                    item.stylesheet = walletStyleSheetType.seedWallet
                    break
            }
            return item
        })
    }

    get wallet() {
        return this.activeAccount.wallet
    }


    get currentXEM1() {
        return this.activeAccount.currentXEM1
    }

    closeCheckPWDialog() {
        this.showCheckPWDialog = false
    }

    switchWallet(newActiveWalletAddress) {
        AppWallet.switchWallet(newActiveWalletAddress, this.walletList, this.$store)
    }

    formatNumber(number) {
        return formatNumber(number)
    }

    formatXEMamount(text) {
        return formatXEMamount(text)
    }

    getWalletBalance(address) {
        const {currentXEM1} = this
        const accountMosaic = localRead(address) ? JSON.parse(localRead(address)) : {}
        const resultMosaic = accountMosaic[currentXEM1] ? accountMosaic[currentXEM1].balance : 0
        return this.formatXEMamount(resultMosaic)
    }

    toImport() {
        this.$emit('toImport')
    }

    toCreate() {
        this.$emit('toCreate')
    }
}
