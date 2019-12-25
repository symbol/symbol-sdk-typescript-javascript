import {Component, Vue} from 'vue-property-decorator'
import WalletImport from '@/views/wallet/wallet-functions/wallet-import/WalletImport.vue'
import {walletFnNavConfig} from '@/config/view/wallet'

@Component({
    components: {
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
