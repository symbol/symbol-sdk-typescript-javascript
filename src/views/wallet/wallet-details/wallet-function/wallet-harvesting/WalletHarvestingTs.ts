import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {StoreAccount} from "@/core/model"
import {networkConfig} from "@/config"
import AccountLinkTransaction from '@/components/forms/account-link/AccountLinkTransaction.vue'
import CreateRemoteAccount from '@/components/forms/create-remote-account/CreateRemoteAccount.vue'
import PersistentDelegationRequest from '@/components/forms/persistent-delegation-request/PersistentDelegationRequest.vue'

const {EMPTY_PUBLIC_KEY} = networkConfig

@Component({
    components: { AccountLinkTransaction, CreateRemoteAccount, PersistentDelegationRequest },
    computed: { ...mapState({ activeAccount: 'account' }) },
})
export class WalletHarvestingTs extends Vue {
    activeAccount: StoreAccount
    viewAccountPropertiesOnly = false
    showAccountLinkTransactionForm = false
    showCreateRemoteAccountForm = false
    showPersistentDelegationForm = false
    remoteAccountPrivatekey = null

    get wallet() {
        return this.activeAccount.wallet
    }

    get linkedAccountKey() {
        return this.wallet.linkedAccountKey
    }

    get remoteAccount() {
        return this.wallet.remoteAccount
    }
    
    get remoteAccountPublicKey() {
        if (this.linkedAccountKey) return this.linkedAccountKey
        if (this.remoteAccount) return this.remoteAccount.publicKey
        return null
    }

    get isLinked(): boolean {
        return this.linkedAccountKey && this.linkedAccountKey !== EMPTY_PUBLIC_KEY
    }

    activateRemoteHarvesting() {
        if (!this.remoteAccount) {
            this.showCreateRemoteAccountForm = true
            return
        }

        this.showPersistentDelegationForm = true
    }

    getActionButtonText(): string {
        if (this.linkedAccountKey) return 'Unlink_now'
        if (this.remoteAccount) return 'Link_now'
        return 'Create_remote_account'
    }

    linkAccountClicked() {
        this.viewAccountPropertiesOnly = false
        if (this.linkedAccountKey || this.remoteAccount) {
            this.showAccountLinkTransactionForm = true
            return
        }

        this.showCreateRemoteAccountForm = true
    }
}
