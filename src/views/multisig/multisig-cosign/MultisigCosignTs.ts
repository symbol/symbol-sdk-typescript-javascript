import {Component, Vue} from 'vue-property-decorator'
import {AccountHttp, Address} from "nem2-sdk"
import {mapState} from "vuex"
import {StoreAccount, TRANSACTIONS_CATEGORIES} from "@/core/model"
import {formatAndSave} from '@/core/services'
import TransactionList from '@/views/monitor/monitor-dashboard/monitor-transaction-list/TransactionList.vue'
@Component({
    components: { TransactionList },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigCosignTs extends Vue {
    activeAccount: StoreAccount
    publicKey = ''
    TRANSACTIONS_CATEGORIES = TRANSACTIONS_CATEGORIES
    
    get targetAddress(): Address {
        return this.publicKey === ''
            ? Address.createFromRawAddress(this.activeAccount.wallet.address)
            : Address.createFromPublicKey(this.publicKey, this.activeAccount.wallet.networkType) 
    }

    async getCosignTransactions() {
        try {
          const {node} = this.activeAccount

          const aggregatedTransactionList = await new AccountHttp(node)
              .aggregateBondedTransactions(this.targetAddress).toPromise()

          aggregatedTransactionList
              .forEach(tx => formatAndSave(tx, this.$store, true, TRANSACTIONS_CATEGORIES.TO_COSIGN))
        
        } catch (error) {
            console.error("MultisigCosignTs -> getCosignTransactions -> error", error)
        }
    }
}
