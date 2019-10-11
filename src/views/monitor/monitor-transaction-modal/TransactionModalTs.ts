import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaicsAndReturnArray} from '@/core/utils'
import {FormattedTransaction, AppInfo, StoreAccount} from '@/core/model'
import MosaicTable from '@/views/monitor/monitor-transaction-modal/mosaic-table/MosaicTable.vue'
@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components:{
        MosaicTable
    }
})
export class TransactionModalTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    isShowInnerDialog = false
    currentInnerTransaction = {}
    @Prop({default: false})
    visible: boolean

    @Prop({default: null})
    activeTransaction: FormattedTransaction

    get show() {
        return this.visible
    }

    set show(val) {
        if (!val) {
            this.$emit('close')
        }
    }

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }
    get mosaics (){
        return this.activeAccount.mosaics
    }

    renderMosaicsToTable(mosaics){
        const mosaicList = renderMosaicsAndReturnArray(mosaics,this.$store)
        return {
            head:['name','amount'],
            data:mosaicList,

        }
    }
    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }
}
