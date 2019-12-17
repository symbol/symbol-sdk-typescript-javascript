import {mapState} from "vuex"
import {Component, Prop, Vue} from 'vue-property-decorator'
import {AppInfo, FormattedTransaction, StoreAccount} from '@/core/model'
import TransactionInfoTemplate
    from '@/components/transaction-details/transaction-info-template/TransactionInfoTemplate.vue'
import {Message} from "@/config"

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        TransactionInfoTemplate,
    },
})
export class TransactionDetailsTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo

    @Prop({default: null}) transaction: FormattedTransaction

    get explorerBasePath() {
        return this.app.explorerBasePath
    }

    get transactionDetails() {
        return this.transaction.formattedInnerTransactions ?
            this.transaction.formattedInnerTransactions.map(item => item.dialogDetailMap) :
            [this.transaction.dialogDetailMap]
    }

    getStatus(): string {
        if (!this.transaction.rawTx.signer) return null
        return this.transaction.isTxConfirmed ? 'confirmed' : 'unconfirmed'
    }

    openExplorer(transactionHash) {
        const {explorerBasePath} = this
        return explorerBasePath + transactionHash
    }
}
