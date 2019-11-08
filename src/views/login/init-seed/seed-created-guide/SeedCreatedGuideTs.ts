import {Password} from "nem2-sdk"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {randomizeMnemonicWordArray} from "@/core/utils"
import {mapState} from "vuex"
import {AppWallet, AppInfo, StoreAccount} from "@/core/model"
import {localRead} from "@/core/utils"
import MnemonicVerification from '@/components/mnemonic-verification/MnemonicVerification.vue'

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    },
    components: {
        MnemonicVerification
    }
})
export class SeedCreatedGuideTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    tags = 0
    mosaics = []
    storeWallet = {}
    showCover = true
    mnemonicRandomArr = []
    confirmedMnemonicList = []
    formItem = {
        currentNetType: '',
        walletName: '',
        password: '',
        checkPW: '',
    }

    @Prop({default: {}})
    createForm: any

    get mnemonic() {
        return this.createForm.seed.split(' ')
    }

    get formInfo() {
        return this.createForm
    }

    get accountName() {
        return this.activeAccount.accountName
    }

    get walletList() {
        return this.app.walletList
    }

    hideCover() {
        this.showCover = false
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

    changeTabs(index) {
        switch (index) {
            case 0:
                this.tags = index
                break
            case 1:
                this.mnemonicRandomArr = randomizeMnemonicWordArray(this.mnemonic)
                this.tags = index
                break
        }
    }

    verificationSuccess() {
        this.createFromMnemonic()
        this.tags = 2
    }


    skipInput() {
      this.verificationSuccess()
    }

    createFromMnemonic() {
        const {accountName} = this
        const {seed, password} = this.formInfo
        const currentNetType = JSON.parse(localRead('accountMap'))[accountName].currentNetType
        try {
            new AppWallet().createFromMnemonic(
                'seedWallet',
                new Password(password),
                seed,
                currentNetType,
                this.$store,
            )
        } catch (error) {
            throw new Error(error)
        }
    }

    removeConfirmedWord(index) {
        this.confirmedMnemonicList.splice(index, 1)
    }

    toWalletPage() {
        this.$router.push('dashBoard')
    }

    toBack() {
        this.confirmedMnemonicList = []
        this.$router.back()
    }
}
