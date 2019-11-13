import {Component, Vue, Watch} from 'vue-property-decorator'
import GuideInto from '@/views/login/guide-into/GuideInto.vue'
import WalletFn from '@/views/wallet/wallet-functions/WalletFunctions.vue'
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
export class WalletTs extends Vue {
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
        this.tabIndex = -1
        this.toMethod = false
        this.$router.replace({path: '/walletPanel'})
    }

    copyObj(obj) {
        const newObj: any = obj instanceof Array ? [] : {}

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

    // @ROUTING
    noHasWallet() {
        this.toCreate()
    }

    // @ROUTING
    setDefaultPage() {
        const name = this.$route.params['name']
        if (name == 'walletImportKeystore') {
            this.toImport()
            return
        }
        if (name == 'walletCreate') {
            this.toCreate()
            return
        }
        this.tabIndex = -1
    }

    mounted() {
        this.setDefaultPage()
    }
}
