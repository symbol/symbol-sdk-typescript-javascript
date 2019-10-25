import {Component, Vue} from 'vue-property-decorator'
import CollectionRecord from '@/components/collection-record/CollectionRecord.vue'
import MultisigTransferTransaction from '@/views/monitor/monitor-transfer/transactions/TransactionForm.vue'
import {mapState} from "vuex"
import {TransferType} from "@/core/model/TransferType";
import {monitorTransferTransferTypeConfig} from '@/config/view/monitor'
import {StoreAccount} from "@/core/model"
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'

@Component({
    components: {
        MultisigTransferTransaction,
        CollectionRecord,
        DisabledForms,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MonitorTransferTs extends Vue {
    activeAccount: StoreAccount
    transferType = TransferType
    transferTypeList = monitorTransferTransferTypeConfig
    currentPrice = 0

    get getWallet() {
        return this.activeAccount.wallet
    }

    get accountAddress() {
        return this.activeAccount.wallet.address
    }

    get node() {
        return this.activeAccount.node
    }

    showSearchDetail() {
        // this.isShowSearchDetail = true
    }

    hideSearchDetail() {

    }

    switchTransferType(index) {
        const list: any = this.transferTypeList
        if (list[index].disabled) {
            return
        }
        list.map((item) => {
            item.isSelect = false
            return item
        })
        list[index].isSelect = true
        this.transferTypeList = list
    }

}
