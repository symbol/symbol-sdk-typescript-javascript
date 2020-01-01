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
        return this.activeAccount.currentAccount.name
    }

    updateDialogCancel() {
        this.$emit('closeUpdateDialog')
    }

    submit() {
        AppWallet.createFromDTO(this.walletToUpdate).updateWalletName(this.wallet.name, this.$store)
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
