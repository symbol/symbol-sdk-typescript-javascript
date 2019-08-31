import {Component, Vue} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import TransferTransaction from './transactions/transfer-transaction/TransferTransaction.vue'
import MultisigTransferTransaction from './transactions/multisig-transfer-transaction/MultisigTransferTransaction.vue'
import {TransferType} from '@/config/index.ts'
import {mapState} from "vuex"

@Component({
    components: {
        TransferTransaction,
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
    TransferType = TransferType
    transferTypeList = [
        {
            name: 'ordinary_transfer',
            isSelect: true,
            disabled: false
        }, {
            name: 'Multisign_transfer',
            isSelect: false,
            disabled: false
        }, {
            name: 'crosschain_transfer',
            isSelect: false,
            disabled: true
        }, {
            name: 'aggregate_transfer',
            isSelect: false,
            disabled: true
        }
    ]
    currentPrice = 0

    get getWallet() {
        return this.activeAccount.wallet
    }

    get accountPublicKey() {
        return this.activeAccount.wallet.publicKey
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
