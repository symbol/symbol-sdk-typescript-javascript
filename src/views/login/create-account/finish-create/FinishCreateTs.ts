import {mapState} from 'vuex'
import {StoreAccount, AppWallet} from '@/core/model';
import {localSave} from '@/core/utils';
import {Vue, Component} from 'vue-property-decorator'
import {Password} from 'nem2-sdk';

@Component({computed: {...mapState({activeAccount: 'account'})}})
export default class FinishCreateTs extends Vue {
    activeAccount: StoreAccount

    get currentAccount() {
        return this.activeAccount.currentAccount
    }

    get accountName() {
      return this.currentAccount.name
    }

    get seed(): string {
      return this.activeAccount.temporaryLoginInfo.mnemonic
    }

    get networkType() {
      return this.activeAccount.currentAccount.networkType
    }

    get password() {
      return this.activeAccount.temporaryLoginInfo.password
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
            this.$store.commit('REMOVE_TEMPORARY_LOGIN_INFO')
            this.$router.push('/dashboard')
            this.setActiveAccount()
        } catch (error) {
            throw new Error(error)
        }
    }

    setActiveAccount(): void {
        localSave('activeAccountName', this.currentAccount.name)
    }
}
