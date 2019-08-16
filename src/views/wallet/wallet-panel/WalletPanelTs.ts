import {localRead} from '@/core/utils/utils'
import {Component, Vue, Watch} from 'vue-property-decorator'
import GuideInto from '@/views/login/guide-into/GuideInto.vue'
import WalletFn from '@/views/wallet/wallet-fn/WalletFn.vue'
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'
import WalletDetails from '@/views/wallet/wallet-details/WalletDetails.vue'
import {getNamespaces} from "@/core/utils/wallet";

@Component({
    components: {
        WalletSwitch,
        WalletDetails,
        GuideInto,
        WalletFn
    },
})
export class WalletPanelTs extends Vue {
    walletList = []
    tabIndex = 0
    toMethod = false

    get nowWalletList() {
        return this.$store.state.app.walletList
    }

    get reloadWalletPage() {
        return this.$store.state.app.reloadWalletPage
    }

    get node() {
        return this.$store.state.account.node
    }

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    toCreate() {
        this.tabIndex = 0
        this.toMethod = true
    }

    toImport() {
        this.tabIndex = 1
        this.toMethod = true
    }

    toWalletDetails() {
        const wallet = this.$store.state.account.wallet;
        let list: any[] = this.$store.state.app.walletList;
        let bl = false
        list.map((item, index) => {
            if (item.address === wallet.address) {
                item = wallet
                bl = true
            }
            return item
        })
        if (!bl) list.unshift(wallet)
        this.walletList = list
        this.$store.commit('SET_WALLET_LIST', list)
        this.$router.replace({path: '/monitorPanel'})
        this.toMethod = false
    }

    backToGuideInto() {
        this.toMethod = false
    }

    copyObj(obj) {
        const newObj: any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {};

        for (const key in obj) {
            const value = obj[key];
            if (value && 'object' == typeof value) {
                newObj[key] = this.copyObj(value);
            } else {
                newObj[key] = value;
            }
        }
        return newObj;
    }

    setWalletList() {
        let list = this.copyObj(this.nowWalletList)
        for (let i in list) {
            this.$set(this.walletList, i, list[i])
        }
        if (this.walletList.length > 0) {
            this.$store.commit('SET_HAS_WALLET', true)
        }
    }

    noHasWallet() {
        this.walletList = []
        this.toCreate()
        this.$store.commit('SET_HAS_WALLET', false)
    }

    hasWallet() {
        this.setWalletList()
    }

    setDefaultPage() {
        const name = this.$route.params['name']
        if (name == 'walletImportKeystore') {
            this.toImport()
            return
        } else if (name == 'walletCreate') {
            this.toCreate()
        }
    }

    setLeftSwitchIcon() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
        const wallets = localRead('wallets')
        let list = wallets ? JSON.parse(wallets) : []
        if (list.length < 1) {
            this.$store.state.app.isInLoginPage = true
        }

    }

    async getMyNamespaces() {
        if (!this.getWallet) {
            this.$store.commit('SET_NAMESPACE', [])
            return
        }
        const list = await getNamespaces(this.getWallet.address, this.node)
        this.$store.commit('SET_NAMESPACE', list)
    }

    initData() {
        if (this.$route.params['create']) return
        this.$store.state.app.isInLoginPage = false
    }

    @Watch('ConfirmedTxList')
    onConfirmedTxChange() {
        this.getMyNamespaces()
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.getMyNamespaces()
    }

    created() {
        this.setLeftSwitchIcon()
        this.setDefaultPage()
        this.setWalletList()
        this.getMyNamespaces()
        this.initData()
    }
}
