import {Component, Prop, Vue, Watch} from 'vue-property-decorator'
import WalletCreate from '@/views/wallet/wallet-functions/wallet-create/WalletCreate.vue'
import WalletCreated from '@/views/wallet/wallet-functions/wallet-created/WalletCreated.vue'
import WalletImport from '@/views/wallet/wallet-functions/wallet-import/WalletImport.vue'
import {walletFnNavConfig} from '@/config/view/wallet'

@Component({
    components: {
        WalletCreate,
        WalletCreated,
        WalletImport
    },
})
export class WalletFunctionsTs extends Vue {
    currentIndex = 1
    createForm = {}
    walletCreated = false
    navList = walletFnNavConfig

    goToPage(index) {
        const target = this.navList[index].to
        this.navList = this.navList.map(item => {
            item.active = item.to == target
            return item
        })
        this.currentIndex = index
    }

    mounted() {
        this.goToPage(1)
    }
}
