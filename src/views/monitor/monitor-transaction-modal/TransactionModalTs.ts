import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaics} from '@/core/utils'
import {FormattedTransaction, AppInfo, StoreAccount} from '@/core/model'

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class TransactionModalTs extends Vue {
    app: AppInfo
    activeAccount: StoreAccount
    isShowInnerDialog = false
    currentInnerTransaction = {}
    renderMosaics = renderMosaics
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

    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }
}
