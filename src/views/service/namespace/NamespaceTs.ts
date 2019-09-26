import {Component, Vue} from 'vue-property-decorator'
import SubNamespace from './namespace-function/sub-namespace/SubNamespace.vue'
import RootNamespace from './namespace-function/root-namespace/RootNamespace.vue'
import NamespaceList from './namespace-function/namespace-list/NamespaceList.vue'
import {mapState} from "vuex"
import {namespaceButtonConfig} from "@/config/view/namespace";
import {StoreAccount} from "@/core/model"

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
    buttonList = namespaceButtonConfig
    activeAccount:StoreAccount

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
