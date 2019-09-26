import {Component, Vue, Watch} from 'vue-property-decorator'
import GuideInto from '@/views/login/guide-into/GuideInto.vue'
import WalletFn from '@/views/wallet/wallet-fn/WalletFn.vue'
import WalletSwitch from '@/views/wallet/wallet-switch/WalletSwitch.vue'
import WalletDetails from '@/views/wallet/wallet-details/WalletDetails.vue'
import {mapState} from "vuex"
import {AppInfo, StoreAccount} from '@/core/model'

@Component({
    components: {
        WalletSwitch,
        WalletDetails,
        GuideInto,
        WalletFn
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app'
        })
    }
})
export class WalletPanelTs extends Vue {
    activeAccount: StoreAccount
    app: AppInfo
    tabIndex = 0
    toMethod = false

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        return this.app.walletList
    }

    get node() {
        return this.activeAccount.node
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
        this.$router.replace({path: '/monitorPanel'})
        this.toMethod = false
    }

    backToGuideInto() {
        this.toMethod = false
    }

    copyObj(obj) {
        const newObj: any = Object.prototype.toString.call(obj) == '[object Array]' ? [] : {}

        for (const key in obj) {
            const value = obj[key]
            if (value && 'object' == typeof value) {
                newObj[key] = this.copyObj(value)
            } else {
                newObj[key] = value
            }
        }
        return newObj
    }

    noHasWallet() {
        this.toCreate()
        this.$store.commit('SET_HAS_WALLET', false)
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

    // @TODO: probably not the best way
    setLeftSwitchIcon() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 1)
    }

    mounted() {
        this.setLeftSwitchIcon()
        this.setDefaultPage()
    }
}
