import {mapState} from 'vuex'
import {Component, Vue} from 'vue-property-decorator'
import DeleteWalletCheck from './delete-wallet-check/DeleteWalletCheck.vue'
import {formatXEMamount, formatNumber, localRead} from '@/core/utils/utils.ts'
import {AppWallet} from "@/core/model"

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
