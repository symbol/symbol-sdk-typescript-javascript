import routers from '@/router/routers.ts'
import {Message, isWindows, languageList, localesMap} from "@/config/index.ts"
import {ListenerApiRxjs} from "@/core/api/ListenerApiRxjs.ts"
import {BlockApiRxjs} from '@/core/api/BlockApiRxjs.ts'
import monitorSeleted from '@/common/img/window/windowSelected.png'
import {Address, Listener, NamespaceHttp, NamespaceId} from "nem2-sdk"
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {localSave} from "@/core/utils/utils.ts"
import {Component, Vue, Watch} from 'vue-property-decorator'
import {windowSizeChange, minWindow, maxWindow, closeWindow} from '@/core/utils/electron.ts'
import {mapState} from 'vuex';

@Component({ computed: {
  ...mapState({
    activeAccount: 'account',
    app: 'app',
  })}
})
export class MenuBarTs extends Vue {
    app: any
    activeAccount: any
    isShowNodeList = false
    isWindows = isWindows
    inputNodeValue = ''
    nodeList = [
        {
            value: 'http://192.168.0.105:3000',
            name: 'my-8',
            url: '192.168.0.105',
            isSelected: false,
        },
        {
            value: 'http://3.0.78.183:3000',
            name: 'my-8',
            url: '3.0.78.183',
            isSelected: false,
        }, {
            value: 'http://13.114.200.132:3000',
            name: 'jp-5',
            url: '13.114.200.132',
            isSelected: false,
        }, {
            value: 'http://47.107.245.217:3000',
            name: 'cn-2',
            url: '47.107.245.217',
            isSelected: true,
        }
    ]
    isNowWindowMax = false
    isShowDialog = true
    activePanelList = [false, false, false, false, false]
    currentWallet = ''
    showSelectWallet = true
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    isNodeHealthy = true
    accountPrivateKey = ''
    accountPublicKey = ''
    accountAddress = ''
    unconfirmedTxListener = null
    confirmedTxListener = null
    txStatusListener = null
    languageList = languageList
    localesMap = localesMap

    get wallet() { return this.activeAccount.wallet || false }
    get walletList() { return this.app.walletList || [] }
    get node() { return this.activeAccount.node }
    get UnconfirmedTxList() { return this.activeAccount.UnconfirmedTx }
    get ConfirmedTxList() { return this.activeAccount.ConfirmedTx }
    get errorTxList() { return this.activeAccount.errorTx }
    get currentNode() { return this.activeAccount.node }
    get language() { return this.$i18n.locale }
    set language(lang) {
        this.$i18n.locale = lang
        localSave('locale', lang)
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

    selectEndpoint(index) {
        this.nodeList.forEach(item => item.isSelected = false)
        this.nodeList[index].isSelected = true
        this.$store.commit('SET_NODE', this.nodeList[index].value)
    }
    // @TODO: vee-validate
    changeEndpointByInput() {
        let inputValue = this.inputNodeValue
        if (inputValue == '') {
            this.$Message.destroy()
            this.$Message.error(this['$t'](Message.NODE_NULL_ERROR))
            return
        }
        if (inputValue.indexOf(':') == -1) {
            inputValue = "http://" + inputValue + ':3000'
        }
        this.$store.commit('SET_NODE', inputValue)
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

    switchWallet(address) {
        const that = this
        const walletList = [...this.walletList]
        let list = [...this.walletList]
        walletList.forEach((item, index) => {
            if (item.address === address) {
                that.$store.state.account.wallet = item
                list.splice(index, 1)
                list.unshift(item)
            }
        })
        this.$store.commit('SET_WALLET_LIST', list)
    }

    accountQuit() {
        this.$store.state.app.currentPanelIndex = 0
        this.$router.push({
            name: "login",
            params: {
                index: '2'
            }
        })
    }

    async getGenerationHash(node) {
        const that = this
        await new BlockApiRxjs().getBlockByHeight(node, 1).subscribe((blockInfo) => {
            that.$store.state.account.generationHash = blockInfo.generationHash
        })
    }

    unconfirmedListener() {
        if (!this.wallet) return
        const node = this.node.replace('http', 'ws')
        const that = this
        this.unconfirmedTxListener && this.unconfirmedTxListener.close()
        this.unconfirmedTxListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerUnconfirmed(this.unconfirmedTxListener, Address.createFromRawAddress(that.wallet.address), that.disposeUnconfirmed)
    }

    confirmedListener() {
        if (!this.wallet) return

        const node = this.node.replace('http', 'ws')
        const that = this
        this.confirmedTxListener && this.confirmedTxListener.close()
        this.confirmedTxListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerConfirmed(this.confirmedTxListener, Address.createFromRawAddress(that.wallet.address), that.disposeConfirmed)
    }

    txErrorListener() {
        if (!this.wallet) return

        const node = this.node.replace('http', 'ws')
        const that = this
        this.txStatusListener && this.txStatusListener.close()
        this.txStatusListener = new Listener(node, WebSocket)
        new ListenerApiRxjs().listenerTxStatus(this.txStatusListener, Address.createFromRawAddress(that.wallet.address), that.disposeTxStatus)
    }

    disposeUnconfirmed(transaction) {
        let list = this.UnconfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            this.$store.state.account.UnconfirmedTx = list
            this.$Notice.success({
                title: this.$t('Transaction_sending').toString(),
                duration: 20,
            });
        }
    }

    disposeConfirmed(transaction) {
        let list = this.ConfirmedTxList
        let unList = this.UnconfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            if (unList.includes(transaction.transactionInfo.hash)) {
                unList.splice(unList.indexOf(transaction.transactionInfo.hash), 1)
            }
            this.$store.state.account.ConfirmedTx = list
            this.$store.state.account.UnconfirmedTx = unList
            this.$Notice.destroy()
            this.$Notice.success({
                title: this.$t('Transaction_Reception').toString(),
                duration: 4,
            });
        }
    }


    disposeTxStatus(transaction) {
        let list = this.errorTxList
        if (!list.includes(transaction.hash)) {
            list.push(transaction.hash)
            this.$store.state.account.errorTx = list
            this.$Notice.destroy()
            this.$Notice.error({
                title: transaction.status.split('_').join(' '),
                duration: 10,
            });
        }
    }
// languageList

    @Watch('currentNode')
    onCurrentNode() {
        const {currentNode} = this
        const that = this
        const linkedMosaic = new NamespaceHttp(currentNode).getLinkedMosaicId(new NamespaceId('nem.xem'))
        linkedMosaic.subscribe((mosaic) => {
            this.$store.state.account.currentXEM1 = mosaic.toHex()
        })
        that.isNodeHealthy = false
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()

        new BlockApiRxjs().getBlockchainHeight(currentNode).subscribe((info) => {
            that.isNodeHealthy = true
            that.getGenerationHash(currentNode)
            that.$Notice.destroy()
            that.$Notice.success({
                title: that.$t(Message.NODE_CONNECTION_SUCCEEDED) + ''
            });
        }, () => {
            that.isNodeHealthy = false
            that.$Notice.destroy()
            that.$Notice.error({
                title: that.$t(Message.NODE_CONNECTION_ERROR) + ''
            })
        })
    }

    @Watch('wallet.address')
    onGetWalletChange() {
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }

    created() {
        if (isWindows) windowSizeChange()
        this.onCurrentNode()
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }
}
