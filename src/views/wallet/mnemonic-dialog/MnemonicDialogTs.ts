import {Crypto} from 'nem2-sdk'
import {hexCharCodeToStr} from '@/core/utils/utils'
import {walletApi} from "@/core/api/walletApi"
import {Component, Vue, Prop, Watch} from 'vue-property-decorator'
import {decryptKey} from "@/core/utils/wallet";
import {randomMnemonicWord} from "@/core/utils/hdWallet";

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
                const DeTxt =decryptKey(this.getWallet, this.wallet.password)
                walletApi.getWallet({
                    name: this.getWallet.name,
                    networkType: this.getWallet.networkType,
                    privateKey: DeTxt.length === 64 ? DeTxt : ''
                }).then(async (Wallet: any) => {
                    const DeMnemonic =decryptKey(this.getWallet['mnemonicEnCodeObj'], this.wallet.password)
                    this.mnemonic = hexCharCodeToStr(DeMnemonic)
                    this.mnemonicRandomArr = randomMnemonicWord(this.mnemonic.split(' '))
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

    toPrePage() {
        this.stepIndex = this.stepIndex - 1
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
