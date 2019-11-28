import {Vue, Component} from 'vue-property-decorator'
import MnemonicVerification from '@/components/mnemonic-verification/MnemonicVerification.vue'
import {mapState} from "vuex"
import {AppInfo, StoreAccount} from "@/core/model"

@Component({
    components: {
        MnemonicVerification
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export default class Step4Ts extends Vue {
    activeAccount: StoreAccount
    app: AppInfo

    get mnemonicWordsList(): string[] {
        return this.app.loadingOverlay.temporaryInfo.mnemonic.split(' ')
    }

    verificationSuccess() {
        this.$router.push('finishCreate')
    }

}
