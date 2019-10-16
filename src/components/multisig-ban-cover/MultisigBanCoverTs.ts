import {Component, Vue} from 'vue-property-decorator'
import {mapState} from "vuex"
import {AppInfo, StoreAccount} from "@/core/model"


@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class MultisigBanCoverTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo

    get isMultisig() {
        const {address} = this.activeAccount.wallet
        const {multisigAccountInfo} = this.activeAccount
        return multisigAccountInfo[address] && multisigAccountInfo[address].cosignatories.length
    }
}
