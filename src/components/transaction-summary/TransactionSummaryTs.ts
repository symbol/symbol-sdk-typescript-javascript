import {Component, Vue, Prop} from 'vue-property-decorator'
import {FormattedTransaction} from '@/core/model'
import TransactionDetails from './transaction-details/TransactionDetails.vue'
@Component({ components:{ TransactionDetails } })
export class TransactionSummaryTs extends Vue {
    isShowInnerDialog = false
    currentInnerTransaction = null

    @Prop({default: null}) formattedTransaction: FormattedTransaction
    @Prop({default: false}) addScroll: boolean
}
