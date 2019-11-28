import {mapState} from "vuex"
import {NamespaceId} from 'nem2-sdk'
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaicsAndReturnArray} from '@/core/utils'
import {
    FormattedTransaction, AppInfo, StoreAccount,
    SpecialTxDetailsKeys, TxDetailsKeysWithValueToTranslate,
} from '@/core/model'
import TransactionDetails from '@/components/transaction-details/TransactionDetails.vue'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
    components: {
        TransactionDetails,
    }
})
export class TransactionModalTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    isShowInnerDialog = false
    currentInnerTransaction = {}
    SpecialTxDetailsKeys = SpecialTxDetailsKeys
    TxDetailsKeysWithValueToTranslate = TxDetailsKeysWithValueToTranslate
    NamespaceId = NamespaceId

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

    get publicKey() {
        return this.activeAccount.wallet.publicKey
    }

    get mosaics() {
        return this.activeAccount.mosaics
    }

    get namespaces() {
        return this.activeAccount.namespaces
    }

    getName(namespaceId: NamespaceId) {
        const hexId = namespaceId.toHex()
        const namespace = this.namespaces.find(({hex}) => hexId === hex)
        if (namespace !== undefined) return namespace.name
        return hexId
    }

    renderMosaicsToTable(mosaics) {
        const mosaicList = renderMosaicsAndReturnArray(mosaics, this.$store)
        return {
            head: ['name', 'amount'],
            data: mosaicList,

        }
    }

    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }
}
