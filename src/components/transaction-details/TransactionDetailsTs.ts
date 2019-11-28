import {mapState} from "vuex"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {
    FormattedTransaction,
    StoreAccount,
} from '@/core/model'
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

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get wallet() {
        return this.activeAccount.wallet
    }


    get transactionDetails() {
        return this.transaction.formattedInnerTransactions ?
            this.transaction.formattedInnerTransactions.map(item => item.dialogDetailMap) :
            [this.transaction.dialogDetailMap]
    }
}
