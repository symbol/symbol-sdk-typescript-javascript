import {getNamespaces} from "@/core/utils/wallet"
import {Component, Vue, Watch} from 'vue-property-decorator'
import SubNamespace from './namespace-function/sub-namespace/SubNamespace.vue'
import RootNamespace from './namespace-function/root-namespace/RootNamespace.vue'
import NamespaceList from './namespace-function/namespace-list/NamespaceList.vue'
import {namespaceButtonList} from '@/config/index.ts'
import {mapState} from "vuex"
@Component({
    components: {
        RootNamespace,
        SubNamespace,
        NamespaceList,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class NamespaceTs extends Vue {
    buttonList = namespaceButtonList
    activeAccount:any

    get node() {
        return this.activeAccount.node
    }

    get getWallet() {
        return this.activeAccount.wallet
    }

    get ConfirmedTxList() {
        return this.activeAccount.ConfirmedTx
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
