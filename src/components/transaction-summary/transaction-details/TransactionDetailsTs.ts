import {mapState} from "vuex"
import {NamespaceId} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaicsAndReturnArray} from '@/core/utils'
import {
    FormattedTransaction, StoreAccount,
    SpecialTxDetailsKeys, TxDetailsKeysWithValueToTranslate,
} from '@/core/model'
import {getNamespaceNameFromNamespaceId} from '@/core/services'
import MosaicTable from '../mosaic-table/MosaicTable.vue'
import CosignatoriesTable from '../cosignatories-table/CosignatoriesTable.vue'
@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components:{
        MosaicTable,
        CosignatoriesTable,
    }
})
export class TransactionDetailsTs extends Vue {
    activeAccount: StoreAccount
    SpecialTxDetailsKeys = SpecialTxDetailsKeys
    TxDetailsKeysWithValueToTranslate = TxDetailsKeysWithValueToTranslate
    getNamespaceNameFromNamespaceId = getNamespaceNameFromNamespaceId
    NamespaceId = NamespaceId

    @Prop({default: null}) transaction: FormattedTransaction

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
}
