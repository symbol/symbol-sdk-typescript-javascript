import {mapState} from "vuex"
import {Message} from "@/config/index.ts"
import {TransactionType, Password} from "nem2-sdk"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {AppAccounts, AppWallet, StoreAccount, LockParams} from "@/core/model"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
})
export class CheckPasswordDialogTs extends Vue {
    stepIndex = 0
    show = false
    activeAccount: StoreAccount
    walletInputInfo = {
        password: ''
    }

    @Prop()
    showCheckPWDialog: boolean

    @Prop({default: ''})
    transactionDetail: any

    @Prop({default: false})
    isOnlyCheckPassword: boolean

    @Prop({
        default: () => {
            return []
        }
    })
    transactionList: Array<any>

    @Prop({
        default: () => {
            return LockParams.default()
        }
    })
    lockParams: LockParams

    get node() {
        return this.activeAccount.node
    }

    get wallet() {
        return this.activeAccount.wallet
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get networkCurrency() {
        return this.activeAccount.networkCurrency
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    checkWalletPassword() {
        try {
            const isPasswordValid = new AppWallet(this.wallet).checkPassword(this.walletInputInfo.password)
            this.show = false
            this.$emit('checkEnd', Boolean(isPasswordValid))
            this.switchAnnounceType()
            this.checkPasswordDialogCancel()
        } catch (e) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            this.$emit('checkEnd', false)
        }
    }

    checkAccountPassword() {
        const {accountName} = this
        const {password} = this.walletInputInfo
        const appAccount = AppAccounts()
        const account = appAccount.getAccountFromLocalStorage(accountName)
        try {
            const accountPassword = appAccount.decryptString(account.password, password)
            if (accountPassword === password) {
                this.$emit('checkEnd', password)
                this.showNotice()
                return
            }
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            this.$emit('checkEnd', false)
        } catch (e) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            this.$emit('checkEnd', false)
        }

    }

    submit() {
        if (this.isOnlyCheckPassword) {
            this.checkAccountPassword()
            return
        }
        this.checkWalletPassword()
    }


    // @VEE-VALIDATE: watch not needed, use showCheckPWDialog as v-model
    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.walletInputInfo.password = ''
        this.show = this.showCheckPWDialog
    }

    switchAnnounceType() {
        const {node, generationHash, transactionList} = this
        const password = new Password(this.walletInputInfo.password)
        const lockFee = this.lockParams.transactionFee
        if (transactionList[0].type !== TransactionType.AGGREGATE_BONDED) {
            // normal transaction
            new AppWallet(this.wallet).signAndAnnounceNormal(password, node, generationHash, transactionList, this)
            return
        }
        // bonded transaction
        new AppWallet(this.wallet).signAndAnnounceBonded( password,
                                                          lockFee,
                                                          transactionList,
                                                          this.$store,
                                                          this,
        )
    }

    showNotice() {
        this.$Notice.success({
            title: this.$t(Message.SUCCESS) + ''
        })
    }
}
