import {Message} from "@/config/index.ts"
import {decryptKey} from "@/core/utils/wallet.ts"
import {WalletApiRxjs} from "@/core/api/WalletApiRxjs.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export class CheckPasswordDialogTs extends Vue {
    stepIndex = 0
    show = false
    wallet = {
        password: ''
    }

    @Prop()
    showCheckPWDialog: boolean

    @Prop({default: ''})
    transactionDetail: any

    get getWallet() {
        return this.$store.state.account.wallet
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    checkPassword() {
        const DeTxt = decryptKey(this.getWallet, this.wallet.password)
        try {
            new WalletApiRxjs().getWallet(
                this.getWallet.name,
                DeTxt.length === 64 ? DeTxt : '',
                this.getWallet.networkType,
            )
            this.show = false
            this.checkPasswordDialogCancel()
            this.$emit('checkEnd', DeTxt)
        } catch (e) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.wallet.password = ''
        this.show = this.showCheckPWDialog
    }

    signAndAnnounce(signedTransaction:Array<any>,privatekey:string){

    }

}
