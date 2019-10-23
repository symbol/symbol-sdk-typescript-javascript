import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaicsAndReturnArray} from '@/core/utils'
import {
    FormattedTransaction, AppInfo, StoreAccount,
    SpecialTxDetailsKeys, TxDetailsKeysWithValueToTranslate,
} from '@/core/model'
import {getNamespaceNameFromNamespaceId} from '@/core/services'
import MosaicTable from './mosaic-table/MosaicTable.vue'
import CosignatoriesTable from './cosignatories-table/CosignatoriesTable.vue'
@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components:{
        MosaicTable,
        CosignatoriesTable,
    }
})
export class TransactionSummaryTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    isShowInnerDialog = false
    currentInnerTransaction = {}
    SpecialTxDetailsKeys = SpecialTxDetailsKeys
    TxDetailsKeysWithValueToTranslate = TxDetailsKeysWithValueToTranslate
    getNamespaceNameFromNamespaceId = getNamespaceNameFromNamespaceId

    @Prop({default: null}) formattedTransaction: FormattedTransaction

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
