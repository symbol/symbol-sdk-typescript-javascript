import {Component, Vue, Watch, Provide} from 'vue-property-decorator'
import {Address} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount, TRANSACTIONS_CATEGORIES} from "@/core/model"
import {standardFields} from "@/core/validation"
import {fetchChildrenPartialTransactions, fetchPartialTransactions} from '@/core/services/multisig/partialTransactions'
import TransactionList from '@/components/transaction-list/TransactionList.vue'
import MultisigTree from '@/views/multisig/multisig-tree/MultisigTree.vue'
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    components: { TransactionList, MultisigTree, ErrorTooltip },
    computed: mapState({ activeAccount: 'account' }),
})
export class MultisigCosignTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    currentAddress = ''
    TRANSACTIONS_CATEGORIES = TRANSACTIONS_CATEGORIES
    standardFields = standardFields

    get wallet() {
        return this.activeAccount.wallet
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
            ? Address.createFromRawAddress(this.activeAccount.wallet.address)
            : Address.createFromRawAddress(this.currentAddress) 
    }

    async submit() {
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.getCosignTransactions()
            })
    }

    getCosignTransactions() {
        fetchPartialTransactions(this.targetAddress, this.$store)
    }
    
    @Watch('wallet.address')
    onGetWalletChange(oldAddress: string, newAddress: string) {
        if (newAddress && newAddress !== oldAddress) {
            fetchChildrenPartialTransactions(
                Address.createFromRawAddress(newAddress),
                this.$store,
            )
        }
    }

    mounted() {
        fetchChildrenPartialTransactions(this.targetAddress, this.$store)
    }
}
