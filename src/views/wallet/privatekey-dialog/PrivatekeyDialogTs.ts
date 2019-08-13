import {Crypto} from 'nem2-sdk'
import {createQRCode} from '@/help/help'
import {walletInterface} from "@/interface/sdkWallet"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component
export class PrivatekeyDialogTs extends Vue {
    QRCode = ''
    show = false
    stepIndex = 0
    wallet = {
        password: '',
        privatekey: ''
    }

    @Prop()
    showPrivatekeyDialog: boolean

    get getWallet() {
        return this.$store.state.account.wallet
    }

    privatekeyDialogCancel() {
        this.wallet = {
            password: '',
            privatekey: ''
        }
        this.$emit('closePrivatekeyDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportPrivatekey() {
        switch (this.stepIndex) {
            case 0 :
                if (!this.checkInput()) return
                let saveData = {
                    ciphertext: this.getWallet.ciphertext,
                    iv: this.getWallet.iv.data ? this.getWallet.iv.data : this.getWallet.iv,
                    key: this.wallet.password
                }
                const DeTxt = Crypto.decrypt(saveData)
                walletInterface.getWallet({
                    name: this.getWallet.name,
                    networkType: this.getWallet.networkType,
                    privateKey: DeTxt.length === 64 ? DeTxt : ''
                }).then(async (Wallet: any) => {
                    this.stepIndex = 1
                    this.wallet.password = ''
                    this.stepIndex = 1
                    this.wallet.privatekey = DeTxt.toString().toUpperCase()
                }).catch(() => {
                    this.$Notice.error({
                        title: this.$t('password_error') + ''
                    })
                })
                break;
            case 1 :
                this.createQRCode()
                this.stepIndex = 2
                break;
            case 2 :
                this.stepIndex = 3
                break;
        }
    }

    checkInput() {
        if (!this.wallet.password || this.wallet.password == '') {
            this.$Notice.error({
                title: '' + this.$t('please_set_your_wallet_password')
            })
            return false
        }
        return true
    }

    toPrevPage() {
        this.stepIndex = 2
    }

    saveQRCode() {

    }

    createQRCode() {
        createQRCode(this.wallet.privatekey).then((data:{url}) => {
            this.QRCode = data.url
        })
    }

    @Watch('showPrivatekeyDialog')
    onShowPrivatekeyDialogChange() {
        this.show = this.showPrivatekeyDialog
    }
}
