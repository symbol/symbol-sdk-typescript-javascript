import {AccountQR} from 'nem2-qr-library'
import {Password, Account} from 'nem2-sdk'
import {copyTxt} from "@/core/utils/utils.ts"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {Message} from "@/config"
import {mapState} from "vuex"
import {AppWallet, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
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
            this.$emit('close')
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
                this.createQRCode()
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

    saveQRCode() {

    }

    createQRCode() {
        const {networkType} = this.getWallet
        const {generationHash} = this
        const {password, privatekey} = this.wallet
        const account: any = Account.createFromPrivateKey(privatekey, networkType) // @QR
        this.QRCode = new AccountQR(account, new Password(password), networkType, generationHash).toBase64()
    }
}
