import {Component, Vue, Prop} from 'vue-property-decorator'
import {mapState} from "vuex"
import {Password} from "nem2-sdk"
import {randomMnemonicWord} from "@/core/utils/hdWallet.ts"
import {AppAccounts, AppWallet, StoreAccount} from "@/core/model"
import {copyTxt} from "@/core/utils"
import {Message} from "@/config"
import {MnemonicPassPhrase} from 'nem2-hd-wallets'
import {MnemonicQR} from 'nem2-qr-library'
import MnemonicVerification from "@/components/mnemonic-verification/MnemonicVerification.vue"
import failureIcon from "@/common/img/monitor/failure.png"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    },
    components: {
        MnemonicVerification
    }
})
export class MnemonicDialogTs extends Vue {
    activeAccount: StoreAccount
    stepIndex = 0
    mnemonic = ''
    mnemonicRandomArr = []
    confirmedMnemonicList = []
    mnemonicQr: any
    wallet = {
        password: '',
        mnemonicWords: ''
    }

    @Prop()
    showMnemonicDialog: boolean

    get show() {
        return this.showMnemonicDialog
    }

    set show(val) {
        if (!val) {
            this.$emit('closeMnemonicDialog')
        }
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get path() {
        return this.getWallet.path
    }

    get generationHash() {
        return this.activeAccount.generationHash
    }

    get QRCode(): string {
        const {generationHash, getWallet} = this
        const {networkType} = getWallet
        const {password, mnemonicWords} = this.wallet
        if (password.length < 8) return ''
        try {
            const mnemonic = new MnemonicPassPhrase(mnemonicWords)
            return new MnemonicQR(mnemonic, new Password(password), networkType, generationHash)
                .toBase64()
        } catch (e) {
            return failureIcon
        }
    }

    closeModal() {
        this.stepIndex = 0
        this.$emit('closeMnemonicDialog')
    }

    jumpToOtherStep(index){
        this.stepIndex = index
    }

    mnemonicDialogCancel() {
        this.wallet = {
            password: '',
            mnemonicWords: ''
        }
        this.$emit('closeMnemonicDialog')
        setTimeout(() => {
            this.stepIndex = 0
        }, 300)
    }

    exportMnemonic() {
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
            case 4 :
                this.mnemonicDialogCancel()
                break
        }
    }

    checkPassword() {
        if (!this.checkInput()) return
        this.mnemonic = AppAccounts().decryptString(this.getWallet.encryptedMnemonic, this.wallet.password)
        this.mnemonicRandomArr = randomMnemonicWord(this.mnemonic.split(' '))
        this.stepIndex = 1
    }

    copyMnemonic() {
        copyTxt(this.mnemonic).then((data) => {
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
                title: this.$t(Message.PLEASE_ENTER_A_CORRECT_NUMBER) + ''
            })
            return false
        }

        if (this.wallet.password.length < 8) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return false
        }

        const validPassword = new AppWallet(this.getWallet).checkPassword(this.wallet.password)

        if (!validPassword) {
            this.$Notice.error({
                title: this.$t(Message.WRONG_PASSWORD_ERROR) + ''
            })
            return false
        }
        return true
    }

    toPrePage() {
        this.confirmedMnemonicList = []
        this.stepIndex = this.stepIndex - 1
    }

    removeConfirmedWord(index) {
        this.confirmedMnemonicList.splice(index, 1)
    }

    sureWord(index) {
        const word = this.mnemonicRandomArr[index]
        const flagIndex = this.confirmedMnemonicList.findIndex(item => word == item)
        if (flagIndex === -1) {
            this.confirmedMnemonicList.push(word)
            return
        }
        this.removeConfirmedWord(flagIndex)
    }

    checkMnemonic() {
        const {confirmedMnemonicList} = this
        if (confirmedMnemonicList.join(' ') != this.mnemonic) {
            if (confirmedMnemonicList.length < 1) {
                this.$Notice.warning({title: '' + this.$t(Message.PLEASE_ENTER_MNEMONIC_INFO)})
            } else {
                this.$Notice.warning({title: '' + this.$t(Message.MNEMONIC_INCONSISTENCY_ERROR)})
            }
            return false
        }

        this.$Notice.success({title: this.$t(Message.SUCCESS) + ''})
        return true
    }

    copyMnemonicQr() {

    }
}
