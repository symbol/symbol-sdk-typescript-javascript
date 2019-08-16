import {Crypto} from 'nem2-sdk'
import {Message} from "@/config"
import {walletApi} from "@/core/api/walletApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export class DeleteWalletCheckTs extends Vue {
    stepIndex = 0
    show = false
    wallet = {
        password: ''
    }

    @Prop()
    showCheckPWDialog: boolean

    get getWallet() {
        return this.$store.state.account.wallet
    }

    checkPasswordDialogCancel() {
        this.$emit('closeCheckPWDialog')
    }

    checkPassword() {
        let saveData = {
            ciphertext: this.getWallet.ciphertext,
            iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
            key: this.wallet.password
        }
        const DeTxt = Crypto.decrypt(saveData)
        walletApi.getWallet({
            name: this.getWallet.name,
            networkType: this.getWallet.networkType,
            privateKey: DeTxt.length === 64 ? DeTxt : ''
        }).then(async (Wallet: any) => {
            this.show = false
            this.checkPasswordDialogCancel()
            this.$emit('checkEnd', DeTxt)
        }).catch(() => {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        })
    }

    @Watch('showCheckPWDialog')
    onShowCheckPWDialogChange() {
        this.wallet.password = ''
        this.show = this.showCheckPWDialog
    }

}
