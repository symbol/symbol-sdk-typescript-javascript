import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {monitorTransferTransferTypeConfig} from '@/config'
import {StoreAccount, TransferType} from "@/core/model"

import Transfer from '@/components/forms/transfer/Transfer.vue'
import CollectionRecord from '@/components/collection-record/CollectionRecord.vue'
import DisabledForms from '@/components/disabled-forms/DisabledForms.vue'

@Component({
    components: {
        Transfer,
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
