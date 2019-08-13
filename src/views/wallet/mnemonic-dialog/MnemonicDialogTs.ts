
import {Crypto} from 'nem2-sdk'
import {hexCharCodeToStr} from '@/help/help'
import {walletInterface} from "@/interface/sdkWallet"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

@Component({
    components: {},
})
export class MnemonicDialogTs extends Vue {
    show = false
    stepIndex = 0
    mnemonic = ''
    mnemonicRandomArr = []
    wallet = {
        password: '',
        mnemonicWords: ''
    }
    @Prop()
    showMnemonicDialog: boolean

    get getWallet() {
        return this.$store.state.account.wallet
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
                    let mnemonicData = {
                        ciphertext: this.getWallet['mnemonicEnCodeObj'].ciphertext,
                        iv: this.getWallet['mnemonicEnCodeObj'].iv.data ? this.getWallet['mnemonicEnCodeObj'].iv.data : this.getWallet['mnemonicEnCodeObj'].iv,
                        key: this.wallet.password
                    }
                    const DeMnemonic = Crypto.decrypt(mnemonicData)
                    this.mnemonic = hexCharCodeToStr(DeMnemonic)
                    this.mnemonicRandom()
                    this.stepIndex = 1
                    this.wallet.password = ''
                }).catch(() => {
                    this.$Notice.error({
                        title: this.$t('password_error') + ''
                    })
                })
                break;
            case 1 :
                this.stepIndex = 2
                break;
            case 2 :
                this.stepIndex = 3
                break;
            case 3 :
                if (!this.checkMnemonic()) return
                this.stepIndex = 4
                break;
            case 4 :
                this.mnemonicDialogCancel()
                break;
        }
    }

    checkInput() {
        if (!this.wallet.password || this.wallet.password == '') {
            this.$Notice.error({
                title: this.$t('please_set_your_wallet_password') + ''
            })
            return false
        }
        return true
    }

    checkRandomArr(arr, mnemonic) {
        const randomNum = this.randomNum(mnemonic)
        if (arr.includes(randomNum)) {
            return this.checkRandomArr(arr, mnemonic)
        } else {
            return randomNum
        }
    }

    randomNum(mnemonic) {
        return Math.floor(Math.random() * (mnemonic.length))
    }

    mnemonicRandom() {
        const mnemonic = this.mnemonic.split(' ');
        let numberArr = [];
        let randomWord = [];
        for (let i = 0; i < mnemonic.length; i++) {
            const randomNum = this.checkRandomArr(numberArr, mnemonic)
            numberArr.push(randomNum)
            randomWord.push(mnemonic[randomNum])
        }
        this.mnemonicRandomArr = randomWord
    }

    sureWord(index) {
        const word = this.mnemonicRandomArr[index]
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        wordSpan.onclick = () => {
            this.$refs['mnemonicWordDiv']['removeChild'](wordSpan)
        }
        this.$refs['mnemonicWordDiv']['append'](wordSpan)
    }

    checkMnemonic() {
        const mnemonicDiv = this.$refs['mnemonicWordDiv'];
        const mnemonicDivChild = mnemonicDiv['getElementsByTagName']('span');
        let childWord = []
        for (let i in mnemonicDivChild) {
            if (typeof mnemonicDivChild[i] !== "object") continue;
            childWord.push(mnemonicDivChild[i]['innerText'])
        }
        if (JSON.stringify(childWord) != JSON.stringify(this.mnemonic.split(' '))) {
            if (childWord.length < 1) {
                this.$Notice.warning({
                    title: this['$t']('Please_enter_a_mnemonic_to_ensure_that_the_mnemonic_is_correct') + ''
                });
                return false
            }
            this.$Notice.warning({
                title: this['$t']('Mnemonic_inconsistency') + ''
            });
            return false
        }
        return true
    }

    @Watch('showMnemonicDialog')
    onShowMnemonicDialogChange() {
        this.show = this.showMnemonicDialog
    }
}
