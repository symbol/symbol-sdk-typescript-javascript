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
    confirmedMnemonicList = []

    @Prop({default: {}})
    createForm: any

    get mnemonic() {
        return this.formInfo.seed.split(' ')
    }

    get formInfo() {
        return this.createForm
    }

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    get walletList() {
        return this.app.walletList
    }

    hideCover() {
        this.showCover = false
    }

    changeTabs(index) {
        switch (index) {
            case 0:
                this.tags = index
                break
            case 1:
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
        const {networkType} = JSON.parse(localRead('accountMap'))[accountName]

        try {
            new AppWallet().createFromMnemonic(
                'seedWallet',
                new Password(password),
                seed,
                networkType,
                this.$store,
            )
        } catch (error) {
            throw new Error(error)
        }
    }

    removeConfirmedWord(index) {
        this.confirmedMnemonicList.splice(index, 1)
    }

    toBack() {
        this.confirmedMnemonicList = []
        this.$router.push('initSeed')
    }
}
