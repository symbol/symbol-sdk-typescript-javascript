import {Component, Vue} from 'vue-property-decorator'
import WalletImportKeystore
    from '@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystore.vue'
import WalletImportPrivatekey
    from '@/views/wallet/wallet-functions/wallet-import/wallet-import-privatekey/WalletImportPrivatekey.vue'
import AccountImportHardware from '@/views/login/init-seed/account-import-hardware/AccountImportHardware.vue'
import {walletImportNavigatorConfig} from '@/config/view/wallet'

@Component({
    components: {
        WalletImportKeystore,
        WalletImportPrivatekey,
        AccountImportHardware
    },
})
export class WalletImportTs extends Vue {
    tabIndex = 0
    navigatorList = walletImportNavigatorConfig
    currentHeadText = ''

    jumpToView(n, index) {
        let list = this.navigatorList
        list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.navigatorList = list
        this.currentHeadText = n.title
        this.tabIndex = index
    }

    mounted() {
        this.jumpToView(this.navigatorList[0], 0)
        this.currentHeadText = this.navigatorList[0].title
    }
}
