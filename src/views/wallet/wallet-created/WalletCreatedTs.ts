import {Message} from "@/config/index.ts"
import {Password} from "nem2-sdk"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {randomMnemonicWord} from "@/core/utils/hdWallet.ts"
import {AppWallet} from "@/core/utils/wallet.ts"
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app:'app'
        })
    }
})
export class WalletCreatedTs extends Vue {
    app:any
    activeAccount:any
    tags = 0
    mosaics = []
    storeWallet = {}
    showCover = true
    mnemonicRandomArr = []
    formItem = {
        currentNetType: '',
        walletName: '',
        password: '',
        checkPW: '',
    }

    @Prop({default: {}})
    createForm: any


    get mnemonic() {
        const mnemonic = this.app.mnemonic
        return mnemonic['split'](' ')
    }

    get formInfo() {
        return this.createForm
    }

    get walletList() {
        return this.app.walletList
    }


    hideCover() {
        this.showCover = false
    }

    sureWord(index) {
        const word = this.mnemonicRandomArr[index]
        const wordSpan = document.createElement('span')
        wordSpan.innerText = word
        wordSpan.onclick = () => {
            this.$refs['mnemonicWordDiv']['removeChild'](wordSpan)
        }
        this.$refs['mnemonicWordDiv']['append'](wordSpan)
    }

    checkMnemonic() {
        const mnemonicDiv = this.$refs['mnemonicWordDiv']
        const mnemonicDivChild = mnemonicDiv['getElementsByTagName']('span')
        let childWord = []
        for (let i in mnemonicDivChild) {
            if (typeof mnemonicDivChild[i] !== "object") continue
            childWord.push(mnemonicDivChild[i]['innerText'])
        }
        if (JSON.stringify(childWord) != JSON.stringify(this.mnemonic)) {
            if (childWord.length < 1) {
                this.$Notice.warning({title: '' + this.$t(Message.PLEASE_ENTER_MNEMONIC_INFO)})
            } else {
                this.$Notice.warning({title: '' + this.$t(Message.MNEMONIC_INCONSISTENCY_ERROR)})
            }
            return false
        }
        return true
    }

    changeTabs(index) {
        switch (index) {
            case 0:
                this.tags = index
                break
            case 1:
                this.mnemonicRandomArr = randomMnemonicWord(this.mnemonic)
                this.tags = index
                break
            case 2:
                if (!this.checkMnemonic()) {
                    return
                }
                this.createFromMnemonic()
                this.tags = index
                break
        }
    }

    skipInput(index) {
      this.createFromMnemonic()
      this.tags = index
    }

    createFromMnemonic() {
      try {
          new AppWallet().createFromMnemonic(
              this.formInfo.walletName,
              new Password(this.formInfo.password),
              this.mnemonic.join(' '),
              this.formInfo.currentNetType,
              this.$store,
          )
      } catch (error) {
        throw new Error(error)
      }
    }

    toWalletPage() {
        this.$store.commit('SET_HAS_WALLET', true)
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeCreated')
    }
}
