import {Component, Vue} from 'vue-property-decorator'
import CollectionRecord from '@/common/vue/collection-record/CollectionRecord.vue'
import TransferTransaction from './transactions/transfer-transaction/TransferTransaction.vue'
import MultisigTransferTransaction from './transactions/multisig-transfer-transaction/MultisigTransferTransaction.vue'

@Component({
    components: {
        TransferTransaction,
        CollectionRecord,
        MultisigTransferTransaction
    }
})
export class MonitorTransferTs extends Vue {
    accountPublicKey = ''
    accountAddress = ''
    node = ''
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

    get getWallet () {
        return this.$store.state.account.wallet
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


    initData() {
        this.accountPublicKey = this.getWallet.publicKey
        this.accountAddress = this.getWallet.address
        this.node = this.$store.state.account.node
    }


    created() {
        this.initData()
    }
}
