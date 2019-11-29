import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {FormattedTransaction, StoreAccount} from '@/core/model'
import TransactionDetails from '@/components/transaction-details/TransactionDetails.vue'

@Component({
    computed: {...mapState({activeAccount: 'account'})},
    components: {
        TransactionDetails,
    }
})
export class TransactionModalTs extends Vue {
    activeAccount: StoreAccount

    @Prop({default: false}) visible: boolean
    @Prop({default: null}) activeTransaction: FormattedTransaction

    get show() {
        return this.visible
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }
}
