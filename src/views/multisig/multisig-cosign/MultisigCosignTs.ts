import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {Address} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount, TRANSACTIONS_CATEGORIES, AppWallet} from "@/core/model"
import {fetchPartialTransactions, fetchSelfAndChildrenPartialTransactions} from '@/core/services/multisig/partialTransactions'
import TransactionList from '@/components/transaction-list/TransactionList.vue'
import MultisigTree from '@/views/multisig/multisig-tree/MultisigTree.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'

@Component({
    components: {TransactionList, MultisigTree, ErrorTooltip, DisabledForms},
    computed: mapState({activeAccount: 'account'}),
})
export class MultisigCosignTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    currentAddress = ''
    TRANSACTIONS_CATEGORIES = TRANSACTIONS_CATEGORIES

    get wallet() {
        return this.activeAccount.wallet
    }

    get address() {
        return this.activeAccount.wallet ? this.activeAccount.wallet.address : null
    }

    get multisigAccounts(): string[] {
        const {multisigAccountInfo} = this.activeAccount
        const {address, networkType} = this.wallet
        if (!multisigAccountInfo[address]) return []
        const multisigAccounts = multisigAccountInfo[address].multisigAccounts
        if (!multisigAccounts.length) return []
        return multisigAccounts
            .map(({publicKey}) => Address.createFromPublicKey(publicKey, networkType).pretty())
    }

    get targetAddress(): Address {
        return this.currentAddress === ''
            ? Address.createFromRawAddress(this.wallet.address)
            : Address.createFromRawAddress(this.currentAddress)
    }

    async submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.getTransactionsToCosign()
            })
    }

    getTransactionsToCosign() {
        this.$store.commit('RESET_TRANSACTIONS_TO_COSIGN')
        fetchPartialTransactions(this.targetAddress, this.$store)
    }

    refreshAll() {
        this.$store.commit('RESET_TRANSACTIONS_TO_COSIGN')
        fetchSelfAndChildrenPartialTransactions(this.wallet.publicAccount, this.$store)
    }

    @Watch('address', {immediate: false})
    onGetWalletChange(newAddress: string, oldAddress: string) {
        if (newAddress && newAddress !== oldAddress) {
            this.$store.commit('RESET_TRANSACTIONS_TO_COSIGN')
            fetchSelfAndChildrenPartialTransactions(this.wallet.publicAccount, this.$store)
        }
    }

    mounted() {
        this.$store.commit('RESET_TRANSACTIONS_TO_COSIGN')
        fetchSelfAndChildrenPartialTransactions(this.wallet.publicAccount, this.$store)
    }
}
