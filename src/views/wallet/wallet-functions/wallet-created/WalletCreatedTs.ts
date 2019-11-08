import {Message} from "@/config/index.ts"
import {Password} from "nem2-sdk"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {randomizeMnemonicWordArray} from "@/core/utils/hdWallet.ts"
import {mapState} from "vuex"
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app:'app'
        })
    }
})
export class WalletCreatedTs extends Vue {
    app:AppInfo
    activeAccount:StoreAccount
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
        const inputArray = this
            .$refs['mnemonicWordDiv']['innerText']
            .replace(' ', '')
            .split("\n")

        const wordInInputArray = inputArray.find(x => x === word)
        if (wordInInputArray === undefined) this.$refs['mnemonicWordDiv']['append'](wordSpan)
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
                this.mnemonicRandomArr = randomizeMnemonicWordArray(this.mnemonic)
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
        this.$emit('toWalletDetails')
    }

    toBack() {
        this.$emit('closeCreated')
    }
}
