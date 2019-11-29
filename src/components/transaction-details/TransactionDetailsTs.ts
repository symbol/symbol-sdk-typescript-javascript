import {mapState} from "vuex"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {FormattedTransaction, StoreAccount} from '@/core/model'
import TransactionInfoTemplate
    from '@/components/transaction-details/transaction-info-template/TransactionInfoTemplate.vue'
import {formatExplorerUrl} from "@/core/utils"

@Component({
    computed: {...mapState({activeAccount: 'account'})},
    components: {
        TransactionInfoTemplate,
    },
})
export class TransactionDetailsTs extends Vue {
    activeAccount: StoreAccount
    formatExplorerUrl = formatExplorerUrl

    @Prop({default: null}) transaction: FormattedTransaction

    get transactionDetails() {
        return this.transaction.formattedInnerTransactions ?
            this.transaction.formattedInnerTransactions.map(item => item.dialogDetailMap) :
            [this.transaction.dialogDetailMap]
    }

    getStatus(): string {
        if (!this.transaction.rawTx.signer) return null
        return this.transaction.isTxConfirmed ? 'confirmed' : 'unconfirmed'
    }
}
