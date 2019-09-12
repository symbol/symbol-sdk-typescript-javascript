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

    switchButton(index) {
        let list = this.buttonList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.buttonList = list
    }
}
