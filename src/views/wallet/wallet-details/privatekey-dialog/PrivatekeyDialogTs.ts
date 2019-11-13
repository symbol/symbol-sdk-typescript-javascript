import {AccountQR} from 'nem2-qr-library'
import {Password, Account} from 'nem2-sdk'
import {copyTxt} from "@/core/utils"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Message} from "@/config"
import {mapState} from "vuex"
import {AppWallet, StoreAccount} from "@/core/model"
import failureIcon from "@/common/img/monitor/failure.png"
import {of} from 'rxjs'
import {pluck, concatMap} from 'rxjs/operators'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    subscriptions() {
        const qrCode$ = this
            .$watchAsObservable('qrCodeArgs', {immediate: true})
            .pipe(pluck('newValue'),
                concatMap((args) => {
                    if (args instanceof AccountQR) return args.toBase64()
                    return of(failureIcon)
                }))
        return {qrCode$}
    }
})
export class PrivatekeyDialogTs extends Vue {
    QRCode = ''
    stepIndex = 0
    activeAccount: StoreAccount
    wallet = {
        password: '',
        privatekey: ''
    }

    @Prop()
    showPrivatekeyDialog: boolean

    get show() {
        return this.showPrivatekeyDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('closePrivatekeyDialog')
        }
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get account() {
        return this.activeAccount
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get qrCodeArgs(): AccountQR {
        const {networkType} = this.getWallet
        const {generationHash} = this
        const {password, privatekey} = this.wallet
        try {
            const account: any = Account.createFromPrivateKey(privatekey, networkType)
            return new AccountQR(account, password, networkType, generationHash)
        } catch (e) {
            return null
        }
    }

    checkPassword() {
        if (!this.checkInput()) return
        try {
            const {privateKey} = new AppWallet(this.getWallet)
                .getAccount(new Password(this.wallet.password))

            this.stepIndex = 1
            this.wallet.privatekey = privateKey.toString().toUpperCase()
        } catch (e) {
            console.error(e)
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
        }
    }


    exportPrivatekey() {
        switch (this.stepIndex) {
            case 0 :
                this.checkPassword()
                break
            case 1 :
                this.stepIndex = 2
                break
            case 2 :
                this.stepIndex = 3
                break
        }
    }

    copyPrivatekey() {
        copyTxt(this.wallet.privatekey).then((data) => {
            this.$Notice.success({
                title: this.$t(Message.COPY_SUCCESS) + ''
            })
        }).catch((error) => {
            console.log(error)
        })
    }

    checkInput() {
        if (!this.wallet.password || this.wallet.password == '') {
            this.$Notice.error({
                title: '' + this.$t(Message.PLEASE_SET_WALLET_PASSWORD_INFO)
            })
            return false
        }
        return true
    }

    toPrevPage() {
        this.stepIndex = 2
    }
}
