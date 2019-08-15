import {getNamespaces} from "@/core/utils/wallet"
import {Component, Vue, Watch} from 'vue-property-decorator'
import SubNamespace from './namespace-function/sub-namespace/SubNamespace.vue'
import RootNamespace from './namespace-function/root-namespace/RootNamespace.vue'
import NamespaceList from './namespace-function/namespace-list/NamespaceList.vue'

@Component({
    components: {
        RootNamespace,
        SubNamespace,
        NamespaceList,
    }
})
export class NamespaceTs extends Vue {
    buttonList = [
        {
            name: 'Create_namespace',
            isSelected: true
        }, {
            name: 'Create_subNamespace',
            isSelected: false
        }, {
            name: 'Namespace_list',
            isSelected: false
        }
    ]

    get node() {
        return this.$store.state.account.node
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    switchButton(index) {
        let list = this.buttonList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.buttonList = list
    }

    async getMyNamespaces() {
        const list = await getNamespaces(this.getWallet.address, this.node)
        this.$store.commit('SET_NAMESPACE', list)
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.getMyNamespaces()
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.getMyNamespaces()
    }

    created() {
        this.getMyNamespaces()
    }
}
