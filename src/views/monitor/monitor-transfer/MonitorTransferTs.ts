import {Component, Vue} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import MultisigTransferTransaction from './transactions/multisig-transfer-transaction/MultisigTransferTransaction.vue'
import {mapState} from "vuex"
import {TransferType} from "@/model/TransferType";
import { monitorTransferTransferTypeConfig } from '@/config/view/monitor'


@Component({
    components: {
        MultisigTransferTransaction,
        CollectionRecord,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MonitorTransferTs extends Vue {
    activeAccount: any
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

    swicthTransferType(index) {
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
