import {Component, Prop, Vue} from 'vue-property-decorator'
import {SpecialTxDetailsKeys, StoreAccount, TxDetailsKeysWithValueToTranslate} from "@/core/model"
import {getNamespaceNameFromNamespaceId} from "@/core/services"
import {NamespaceId} from "nem2-sdk"
import {renderMosaicsAndReturnArray} from "@/core/utils"
import {mapState} from "vuex"
import MosaicTable from '../../mosaic-table/MosaicTable.vue'
import CosignatoriesTable from '../../cosignatories-table/CosignatoriesTable.vue'
import {CollapsePanel as Panel, Collapse} from 'view-design'
import {explorerUrlHead} from "@/config"

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        MosaicTable,
        CosignatoriesTable,
        Panel,
        Collapse
    }
})
export default class extends Vue {
    @Prop()
    dialogDetailMap

    activeAccount: StoreAccount
    SpecialTxDetailsKeys = SpecialTxDetailsKeys
    TxDetailsKeysWithValueToTranslate = TxDetailsKeysWithValueToTranslate
    getNamespaceNameFromNamespaceId = getNamespaceNameFromNamespaceId
    NamespaceId = NamespaceId

    get mosaics() {
        return this.activeAccount.mosaics
    }

    getExplorerUrl(transactionHash) {
        return explorerUrlHead + transactionHash

    }

    renderMosaicsToTable(mosaics) {
        const mosaicList = renderMosaicsAndReturnArray(mosaics, this.$store)
        return {
            head: ['name', 'amount'],
            data: mosaicList,

        }
    }
}
