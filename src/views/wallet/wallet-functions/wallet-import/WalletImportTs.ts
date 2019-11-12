import {Component, Vue} from 'vue-property-decorator'
import WalletImportKeystore
    from '@/views/wallet/wallet-functions/wallet-import/wallet-import-keystore/WalletImportKeystore.vue'
import WalletImportPrivatekey
    from '@/views/wallet/wallet-functions/wallet-import/wallet-import-privatekey/WalletImportPrivatekey.vue'
import AccountImportHardware from '@/views/login/init-seed/account-import-hardware/AccountImportHardware.vue'
import {networkTypeConfig} from '@/config/view/setting'
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
    currentTab = 'mnemonic'
    netType = networkTypeConfig
    navigatorList = walletImportNavigatorConfig
    currentHeadText = ''
    mnemonic = {
        mnemonic: '',
        password: '',
    }
    privateKey = {
        privateKey: '',
        password: '',
        checkPW: '',
    }
    keystore = {
        keystore: '',
        password: '',
    }


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

    changeTab(name) {
        this.currentTab = name
    }

    success(title, desc) {
        this.$Notice.success({
            title: title,
            desc: desc ? desc : ''
        })
    }


    importWallet() {
        switch (this.currentTab) {
            case 'mnemonic':
                this.$store.commit('SET_WALLET_LIST', [{name: 'a'}])
                this.success(this['$t']('Successfully_imported_wallet'), '')
                this.mnemonic = {
                    mnemonic: '',
                    password: '',
                }
                break
            case 'privateKey':
                this.$store.commit('SET_WALLET_LIST', [{name: 'a'}])
                this.success(this['$t']('Successfully_imported_wallet'), '')
                this.privateKey = {
                    privateKey: '',
                    password: '',
                    checkPW: '',
                }
                break
            case 'keystore':
                this.$store.commit('SET_WALLET_LIST', [{name: 'a'}])
                this.success(this['$t']('Successfully_imported_wallet'), '')
                this.keystore = {
                    keystore: '',
                    password: '',
                }
                break
        }
    }

    mounted() {
        this.jumpToView(this.navigatorList[0], 0)
        this.currentHeadText = this.navigatorList[0].title
    }
}
