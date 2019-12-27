import {Vue, Component} from 'vue-property-decorator'
import MnemonicVerification from '@/components/mnemonic-verification/MnemonicVerification.vue'
import {mapState} from "vuex"
import {StoreAccount} from "@/core/model"

@Component({
    components: {
        MnemonicVerification
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
        })
    }
})
export default class Step4Ts extends Vue {
    activeAccount: StoreAccount

    get mnemonicWordsList(): string[] {
        return this.activeAccount.temporaryLoginInfo.mnemonic.split(' ')
    }
}
