import {Message} from "@/config/index.ts"
import {decryptKey, encryptKeystore} from "@/core/utils/wallet.ts"
import {copyTxt, localRead} from "@/core/utils/utils.ts"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class KeystoreDialogTs extends Vue {
    activeAccount: any
    stepIndex = 0
    show = false
    QRCode = ''
    keystoreText = ''
    wallet = {
        password: ''
    }

    @Prop()
    showKeystoreDialog: boolean


    get getWallet() {
        return this.activeAccount.wallet
    }

    saveQRCode() {

    }

    keystoreDialogCancel() {
        this.$emit('closeKeystoreDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportKeystore() {
        switch (this.stepIndex) {
            case 0 :
                this.checkWalletPassword()
                break
            case 1 :
                this.generateKeystore()
                break
            case 2 :
                this.stepIndex = 3
                break
        }
    }
    
    // @TODO: move to AppWallet and encode in base 64
    async generateKeystore() {
        const walletList = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
        const walletAddress = this.getWallet.address
        const wallet = walletList.find(({address})=> address === walletAddress)
        if (wallet === undefined) throw new Error('the wallet was not found in the list')
        this.keystoreText = JSON.stringify(wallet.simpleWallet)
        this.stepIndex = 2
    }

    // @TODO: VeeValidate
    checkWalletPassword() {
        // if (!this.checkInput()) return
        this.stepIndex = 1
    }

    checkInput() {
        const {password} = this.wallet
        if (!password || password == '') {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.PLEASE_SET_WALLET_PASSWORD_INFO) + ''
            })
            return false
        }
        const privatekey = decryptKey(this.getWallet, this.wallet.password) + ''
        if (privatekey.length !== 64) {
            this.$Notice.destroy()
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    toPrevPage() {
        this.stepIndex = 2
    }

    copyKeystore() {
        copyTxt(this.keystoreText).then((data) => {
            this.$Notice.success({
                title: this.$t(Message.COPY_SUCCESS) + ''
            })
        }).catch((error) => {
            console.log(error)
        })
    }


    @Watch('showKeystoreDialog')
    onShowKeystoreDialogChange() {
        this.show = this.showKeystoreDialog
    }
}
