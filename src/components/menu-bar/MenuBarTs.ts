import {isWindows, Message, defaultNodeList} from "@/config/index.ts"
import monitorSelected from '@/common/img/window/windowSelected.png'
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {completeUrlWithHostAndProtocol, localSave} from "@/core/utils"
import {Component, Provide, Vue} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, unMaximize, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'
import {NetworkType} from "nem2-sdk"
import {languageConfig} from "@/config/view/language"
import {StoreAccount, AppWallet, AppInfo, Notice, NoticeType, Endpoint} from "@/core/model"
import routes from '@/router/routers'
import {validation} from "@/core/validation"
import ErrorTooltip from '@/components/other/forms/errorTooltip/ErrorTooltip.vue'

@Component({
    components: {
        ErrorTooltip
    },
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MenuBarTs extends Vue {
    @Provide() validator: any = this.$validator
    activeAccount: StoreAccount
    app: AppInfo
    minWindow = minWindow
    validation = validation
    isWindows = isWindows
    inputNodeValue = ''
    isNowWindowMax = false
    monitorSelected = monitorSelected
    monitorUnselected = monitorUnselected
    languageList = languageConfig
    NetworkType = NetworkType
    closeWindow = closeWindow

    get routes() {
        return routes[0].children
            .filter(({meta}) => meta.clickable)
            .map(({path, meta}) => ({path, meta}))
    }

    get NetworkProperties() {
        return this.app.NetworkProperties
    }

    get isNodeHealthy() {
        if (!this.NetworkProperties) return true
        return this.NetworkProperties.healthy
    }

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        return this.app.walletList || []
    }

    get networkType() {
        return this.activeAccount.wallet ? NetworkType[this.activeAccount.wallet.networkType] : false
    }

    get node() {
        return this.activeAccount.node
    }

    set node(newNode: string) {
        this.$store.commit('SET_NODE', `${newNode}`)
    }

    get nodeList() {
        return this.app.nodeList
    }

    set nodeList(nodeList: Endpoint[]) {
        this.$store.commit('SET_NODE_LIST', nodeList)
    }

    get language() {
        return this.$i18n.locale
    }

    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    get nodeNetworkTypeText() {
        const {healthy, networkType} = this.app.NetworkProperties
        if (!healthy) return this.$t('Invalid_node')
        return networkType ? NetworkType[networkType] : this.$t('Loading')
    }

    get currentWalletAddress() {
        if (!this.wallet) return null
        return this.activeAccount.wallet.address
    }

    set currentWalletAddress(newActiveWalletAddress) {
        AppWallet.updateActiveWalletAddress(newActiveWalletAddress, this.$store)
    }
    
    get accountName() {
        return this.activeAccount.currentAccount.name
    }

    refreshValidate() {
        this.inputNodeValue = ''
        this.$validator.reset()
    }

    accountQuit() {
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_ACCOUNT')
        this.$router.push('login')
    }

    maxWindow() {
        this.isNowWindowMax = !this.isNowWindowMax
        maxWindow()
    }

    unMaximize() {
        this.isNowWindowMax = !this.isNowWindowMax
        unMaximize()
    }

    removeNode(clickedNode: string) {
        if (this.nodeList.length === 1) {
            Notice.trigger(Message.NODE_ALL_DELETED, NoticeType.error, this.$store)
            return
        }

        const nodeList = [...this.nodeList]

        nodeList.splice(
            nodeList.findIndex(({value}) => value === clickedNode),
            1,
        )

        if (clickedNode === this.node) this.node = nodeList[0].value
        this.nodeList = nodeList
    }

    selectEndpoint(index) {
        if (this.node === this.nodeList[index].value) return
        this.node = this.nodeList[index].value
        this.refreshValidate()
    }

    submit() {
        let {inputNodeValue} = this
        this.$validator
            .validate()
            .then((valid) => {
                if (!valid) return
                this.inputNodeValue = completeUrlWithHostAndProtocol(inputNodeValue)
                this.createNewNode()
            })
    }

    createNewNode() {
        const {inputNodeValue} = this
        const nodeList = [...this.nodeList]
        const nodeIndexInList = nodeList.findIndex(item => item.value == inputNodeValue)
        
        if (nodeIndexInList > -1) nodeList.splice(nodeIndexInList, 1)
        
        nodeList.unshift({
            value: inputNodeValue,
            name: inputNodeValue,
            url: inputNodeValue
        })

        this.nodeList = nodeList
        this.selectEndpoint(0)
    }

    resetNodeListToDefault() {
        this.nodeList = defaultNodeList
        this.selectEndpoint(0)
    }

    created() {
        if (isWindows) windowSizeChange()
    }
}
