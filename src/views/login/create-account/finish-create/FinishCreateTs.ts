import {Vue, Component} from 'vue-property-decorator'
import {AppInfo, AppWallet, CurrentAccount, StoreAccount} from "@/core/model"
import {localRead, localSave} from "@/core/utils"
import {Password} from "nem2-sdk"
import {mapState} from "vuex"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export default class FinishCreateTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo

    get accountName() {
        return this.activeAccount.currentAccount.networkType
    }

    get seed(): string {
        return this.app.loadingOverlay.temporaryInfo.mnemonic
    }

    get networkType() {
        return this.activeAccount.currentAccount.networkType
    }

    get password() {
        return this.app.loadingOverlay.temporaryInfo.password
    }

    submit() {
        const {accountName, seed, networkType, password} = this
        try {
            new AppWallet().createFromMnemonic(
                'SeedWallet',
                new Password(password),
                seed,
                networkType,
                this.$store,
            )
            localSave('activeAccountName', accountName)
            this.$store.commit('REMOVE_TEMPORARY_INFO')
            this.$router.push('/dashboard')
        } catch (error) {
            console.log(error)
            throw new Error(error)
        }
    }


}
