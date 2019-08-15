import {Crypto} from 'nem2-sdk'
import {QRCodeGenerator} from 'nem2-qr-library'
import {walletApi} from "@/core/api/walletApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {decryptKey} from "@/core/utils/wallet";

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
                const DeTxt = decryptKey(this.getWallet, this.wallet.password)
                walletApi.getWallet({
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
        const {networkType} = this.getWallet
        const {generationHash} = this.$store.state.account
        const object = {privateKey: this.wallet.privatekey}
        this.QRCode = QRCodeGenerator
            .createExportObject(object, networkType, generationHash)
            .toBase64()
    }

    @Watch('showPrivatekeyDialog')
    onShowPrivatekeyDialogChange() {
        this.show = this.showPrivatekeyDialog
    }
}
