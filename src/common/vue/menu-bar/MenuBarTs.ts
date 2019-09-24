import routers from '@/router/routers.ts'
import {Message, isWindows} from "@/config/index.ts"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import monitorSeleted from '@/common/img/window/windowSelected.png'
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {localRead, localSave} from "@/core/utils/utils.ts"
import {Component, Vue} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex'
import {NetworkType} from "nem2-sdk"
import {languageConfig} from "@/config/view/language"
import {LanguageType} from "@/core/model/LanguageType"
import {nodeListConfig} from "@/config/view/node"
import {getCurrentBlockHeight, getCurrentNetworkMosaic, getNetworkGenerationHash} from "@/core/utils"
import {AppWallet} from "@/core/model"

@Component({
    computed: {
        ...mapState({
            activeAccount: 'account',
            app: 'app',
        })
    }
})
export class MenuBarTs extends Vue {
    NetworkType = NetworkType
    app: any
    nodeList = []
    activeAccount: any
    isShowNodeList = false
    isWindows = isWindows
    inputNodeValue = ''
    isNowWindowMax = false
    isShowDialog = true
    activePanelList = [false, false, false, false, false, false, false,]
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    accountAddress = ''
    txStatusListener = null
    languageList = languageConfig
    localesMap = LanguageType

    get isNodeHealthy() {
        return this.app.isNodeHealthy
    }

    get wallet() {
        return this.activeAccount.wallet || false
    }

    get walletList() {
        return this.app.walletList || []
    }

    get currentPanelIndex() {
        return this.app.currentPanelIndex
    }

    get networkType() {
        return this.activeAccount.wallet.networkType
    }

    get node() {
        return this.activeAccount.node
    }

    get currentNode() {
        return this.activeAccount.node
    }

    get language() {
        return this.$i18n.locale
    }


    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
    }

    get currentWalletAddress() {
        if (!this.wallet) return false
        return this.activeAccount.wallet.address
    }

    get accountName() {
        return this.activeAccount.accountName
    }


    set currentWalletAddress(newActiveWalletAddress) {
        AppWallet.switchWallet(newActiveWalletAddress, this.walletList, this.$store)
    }

    closeWindow() {
        closeWindow()
    }

    maxWindow() {
        this.isNowWindowMax = !this.isNowWindowMax
        maxWindow()
    }

    minWindow() {
        minWindow()
    }

    async selectEndpoint(index) {
        if (this.node == this.nodeList[index].value) return
        this.nodeList.forEach(item => item.isSelected = false)
        this.nodeList[index].isSelected = true
        const node = this.nodeList[index].value
        this.$store.commit('SET_NODE', this.nodeList[index].value)
        await getNetworkGenerationHash(node, this)
        await getCurrentBlockHeight(node, this.$store)
        await getCurrentNetworkMosaic(node, this.$store)
    }

    // @TODO: vee-validate
    changeEndpointByInput() {
        // let inputValue = this.inputNodeValue
        let {nodeList, inputNodeValue} = this
        if (inputNodeValue == '') {
            this.$Message.destroy()
            this.$Message.error(this['$t'](Message.NODE_NULL_ERROR))
            return
        }
        nodeList.push({
            value: `http://${inputNodeValue}`,
            name: inputNodeValue,
            url: inputNodeValue,
            isSelected: false,
        })
        this.nodeList = nodeList
        localSave('nodeList', JSON.stringify(nodeList))
    }

    toggleNodeList() {
        this.isShowNodeList = !this.isShowNodeList
    }

    switchPanel(index) {
        if (!this.app.walletList.length) return
        const routerIcon = routers[0].children
        this.$router.push({
            params: {},
            name: routerIcon[index].name
        })
        this.$store.commit('SET_CURRENT_PANEL_INDEX', index)
    }

    accountQuit() {
        this.$store.commit('SET_CURRENT_PANEL_INDEX', 0)
        this.$store.commit('RESET_APP')
        this.$store.commit('RESET_ACCOUNT')
        this.$router.push({
            name: "login"
        })
    }

    async getGenerationHash(node) {
        const that = this
        await new BlockApiRxjs().getBlockByHeight(node, 1).subscribe((blockInfo) => {
            that.$store.commit('SET_GENERATION_HASH', blockInfo.generationHash)
        })
    }

    initNodeList() {
        const nodeListData = localRead('nodeList')
        this.nodeList = nodeListData ? JSON.parse(nodeListData) : nodeListConfig
    }

    created() {
        if (isWindows) windowSizeChange()
        this.initNodeList()
    }
}
