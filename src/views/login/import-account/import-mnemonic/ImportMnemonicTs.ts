import {Vue, Component} from 'vue-property-decorator'
import {getAccountFromPathNumber} from "@/core/utils"
import {AppInfo, AppWallet, StoreAccount, AppAccounts} from "@/core/model"
import {Password} from "nem2-sdk"
import {mapState} from "vuex"
import {Message} from "@/config"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export default class ImportMnemonicTs extends Vue {
    seed: string = ''
    activeAccount: StoreAccount
    app: AppInfo

    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    get networkType() {
        return this.activeAccount.currentAccount.networkType
    }


    get password() {
        return this.app.loadingOverlay.temporaryInfo.password
    }

    checkSeed() {
        const {seed, networkType} = this
        if (!seed || !seed.trim()) {
            this.$Notice.error({title: this.$t(Message.INPUT_EMPTY_ERROR) + ''})
            return false
        }
        try {
            getAccountFromPathNumber(seed, 0, networkType)  //use for check mnemonic
        } catch (e) {
            this.$Notice.error({title: 'Invalid mnemonic'})
            return false
        }

        return true
    }

    submit() {
        if (!this.checkSeed()) return
        const {seed, password} = this
        try {
            new AppWallet().createAccountFromMnemonic(
                new Password(password),
                seed,
                this.$store,
            )
            this.$store.commit('SET_TEMPORARY_MNEMONIC', this.seed)
            this.$router.push('walletChoose')
        } catch (error) {
            this.$Notice.error({title: 'Creation failed'})
            throw new Error(error)
        }
    }

    goToCreateAccountInfo() {
        AppAccounts().deleteAccount(this.accountName)
        this.$router.push('inputAccountInfo')
    }
}
