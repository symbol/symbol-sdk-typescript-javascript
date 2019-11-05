import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class TheWalletUpdateTs extends Vue {
    activeAccount: StoreAccount
    stepIndex = 0
    show = false
    wallet = {
        name: ''
    }

    @Prop()
    showUpdateDialog: boolean

    @Prop()
    walletToUpdate: AppWallet

    get accountName() {
        return this.activeAccount.accountName
    }

    checkPasswordDialogCancel() {
    }

    updateDialogCancel() {
        this.$emit('closeUpdateDialog')
    }

    submit() {
        const {name} = this.wallet
        const {accountName, walletToUpdate} = this
        new AppWallet().updateWalletName(accountName, name, walletToUpdate.address, this.$store)
        this.$emit('closeUpdateDialog')
    }

    @Watch('showUpdateDialog')
    onShowCheckPWDialogChange() {
        this.wallet.name = ''
        this.show = this.showUpdateDialog
    }

    mounted() {
        this.wallet.name = this.walletToUpdate.name
    }
}
