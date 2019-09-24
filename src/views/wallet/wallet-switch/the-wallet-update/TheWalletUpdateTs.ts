import {Password} from 'nem2-sdk'
import {Message} from "@/config/index.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from 'vuex'
import {AppWallet} from "@/core/model"
import {localRead, localSave} from "@/core/utils"

@Component({
    computed: {
        ...mapState({activeAccount: 'account'})
    }
})
export class TheWalletUpdateTs extends Vue {
    activeAccount: any
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

    created() {
        this.wallet.name = this.walletToUpdate.name
    }
}
