import {mapState} from "vuex"
import {Component, Vue} from 'vue-property-decorator'
import {StoreAccount} from "@/core/model"
import MultisigConversion from '../multisig-conversion/MultisigConversion.vue'
import MultisigModification from '../multisig-modification/MultisigModification.vue'

@Component({
    components: {
        MultisigConversion,
        MultisigModification,
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export class MultisigTransactionsTs extends Vue {
    activeAccount: StoreAccount
    get hasCosignatories(): boolean {
        const {wallet, multisigAccountInfo} = this.activeAccount
        const currentMultisigAccountInfo = multisigAccountInfo[wallet.address]
        return currentMultisigAccountInfo && currentMultisigAccountInfo.cosignatories.length > 0
    }
}
