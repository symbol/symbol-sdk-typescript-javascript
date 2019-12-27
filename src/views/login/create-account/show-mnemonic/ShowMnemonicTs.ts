import {mapState} from "vuex"
import {Vue, Component} from 'vue-property-decorator'
import {StoreAccount} from '@/core/model'


@Component({computed: {...mapState({activeAccount: 'account'})}})
export default class ShowMnemonicTs extends Vue {
    activeAccount: StoreAccount
    showMnemonic = false

    get mnemonicWordsList() {
        return this.activeAccount.temporaryLoginInfo.mnemonic.split(' ')
    }
}
