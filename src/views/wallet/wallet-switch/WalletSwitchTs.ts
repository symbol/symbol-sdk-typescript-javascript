import {mapState} from 'vuex'
import {AppWallet} from '@/core/utils/wallet.ts'
import {Component, Vue} from 'vue-property-decorator'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'
import {formatXEMamount, formatNumber} from '@/core/utils/utils.ts'

@Component({
    components: {DeleteWalletCheck},
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
  
    get walletList() {
        return this.app.walletList
    }

    get wallet() {
        return this.activeAccount.wallet
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

    getWalletBalance(index) {
        const {balance} = this.walletList[index]
        if (!balance || balance === 0) return 0
        return this.formatXEMamount(balance)
    }

    toImport() {
        this.$emit('toImport')
    }

    toCreate() {
        this.$emit('toCreate')
    }
}
