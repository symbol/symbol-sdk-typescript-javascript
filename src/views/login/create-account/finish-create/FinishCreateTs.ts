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

    submit() {
        this.createNewWallet()
        this.setActiveAccount()
        this.$store.commit('REMOVE_TEMPORARY_LOGIN_INFO')
        this.$router.push('dashBoard')
    }

    createNewWallet(): void {
        const {password, mnemonic} = this.activeAccount.temporaryLoginInfo

        new AppWallet().createFromMnemonic(
            'SeedWallet',
            new Password(password),
            mnemonic,
            this.currentAccount.networkType,
            this.$store,
        )
    }

    setActiveAccount(): void {
        localSave('activeAccountName', this.currentAccount.name)
    }
}
