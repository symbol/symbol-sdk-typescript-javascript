import {mapState} from "vuex"
import {Component, Vue, Prop} from 'vue-property-decorator'
import {renderMosaics} from '@/core/utils'
import {FormattedTransaction} from '@/core/model';

@Component({
    computed: {...mapState({activeAccount: 'account', app: 'app'})},
})
export class TransactionModalTs extends Vue {
    app: any
    activeAccount: any
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

    get mosaicList() {
        return this.activeAccount.mosaics
    }

    get currentXem() {
        return this.activeAccount.currentXem
    }
    
    showInnerDialog(currentInnerTransaction) {
        this.isShowInnerDialog = true
        this.currentInnerTransaction = currentInnerTransaction
    }
}
