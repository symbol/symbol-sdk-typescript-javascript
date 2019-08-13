import axios from 'axios'
import routers from '@/router/routers'
import {Message} from "@/config/index"
import {wsInterface} from "@/interface/sdkListener"
import {blockchainInterface} from '@/interface/sdkBlockchain.js'
import {aliasInterface} from '@/interface/sdkNamespace'
import monitorSeleted from '@/common/img/window/windowSelected.png'
import {Address, Listener, NamespaceHttp, NamespaceId} from "nem2-sdk"
import monitorUnselected from '@/common/img/window/windowUnselected.png'
import {sessionRead, sessionSave, localSave, localRead} from "@/help/help"
import {Component, Vue, Watch} from 'vue-property-decorator/lib/vue-property-decorator'

@Component
export class MenuBarTs extends Vue {
    isShowNodeList = false
    inputNodeValue = ''
    nodetList = [
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
            isSelected: true,
        }, {
            value: 'http://47.107.245.217:3000',
            name: 'cn-2',
            url: '47.107.245.217',
            isSelected: false,
        }
    ]
    isShowDialog = true
    activePanelList = [false, false, false, false, false]
    currentLanguage: any = false
    languageList = []
    currentWallet = ''
    showSelectWallet = true
    monitorSeleted = monitorSeleted
    monitorUnselected = monitorUnselected
    currentNode = ''
    isNodeHealthy = true
    accountPrivateKey = ''
    accountPublicKey = ''
    accountAddress = ''
    walletList = []
    unconfirmedTxListener = null
    confirmedTxListener = null
    txStatusListener = null

    get getWallet() {
        return this.$store.state.account.wallet
    }

    get getWalletList() {
        return this.$store.state.app.walletList || []
    }

    get node() {
        return this.$store.state.account.node
    }

    get UnconfirmedTxList() {
        return this.$store.state.account.UnconfirmedTx
    }

    get ConfirmedTxList() {
        return this.$store.state.account.ConfirmedTx
    }

    get errorTxList() {
        return this.$store.state.account.errorTx
    }

    closeWindow() {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'quit')
    }

    maxWindow() {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'max')
    }

    minWindow() {
        const ipcRenderer = window['electron']['ipcRenderer'];
        ipcRenderer.send('app', 'min')
    }

    windowSizeChange() {
        if (window['electron']) {
            const electron = window['electron'];
            const mainWindow = electron.remote.getCurrentWindow()
            const that = this
            mainWindow.on('resize', () => {
                that.resetFontSize()
            })
        }
    }

    resetFontSize() {
        if (window['electron']) {
            const locaZomm = sessionRead('zoomFactor') || 1
            const devInnerWidth = 1689
            const winWidth = window.innerWidth * Number(locaZomm)
            const scaleFactor = window['electron'].screen.getPrimaryDisplay().scaleFactor;
            let zoomFactor = winWidth / devInnerWidth;
            if (winWidth > devInnerWidth && winWidth < 1920) {
                zoomFactor = 1
            } else if (winWidth >= 1920) {
                zoomFactor = winWidth / 1920;
            }
            sessionSave('zoomFactor', zoomFactor)
            window['electron'].webFrame.setZoomFactor(zoomFactor);
        }
    }

    selectPoint(index) {
        let list = this.nodetList
        list = list.map((item) => {
            item.isSelected = false
            return item
        })
        list[index].isSelected = true
        this.currentNode = list[index].value
        this.nodetList = list
    }

    changePointByInput() {
        let inputValue = this.inputNodeValue
        if (inputValue == '') {
            this.$Message.destroy()
            this.$Message.error(this['$t'](Message.NODE_NULL_ERROR))
            return
        }
        if (inputValue.indexOf(':') == -1) {
            inputValue = "http://" + inputValue + ':3000'
        }
        this.currentNode = inputValue
    }

    toggleNodeList() {
        this.isShowNodeList = !this.isShowNodeList
    }

    switchPanel(index) {
        if (this.$store.state.app.isInLoginPage) {
            return
        }
        const routerIcon = routers[0].children

        this.$router.push({
            params: {},
            name: routerIcon[index].name
        })
        this.$store.commit('SET_CURRENT_PANEL_INDEX', index)
    }

    switchLanguage(language) {
        this.$store.state.app.local = {
            abbr: language,
            language: this.$store.state.app.localMap[language]
        }
        // @ts-ignore
        this.$i18n.locale = language
        localSave('local', language)
    }

    switchWallet(address) {
        const {walletList} = this
        const that = this
        let list = walletList
        walletList.map((item, index) => {
            if (item.address == address) {
                that.$store.state.account.wallet = item
                list.splice(index, 1)
                list.unshift(item)
            }
        })
        this.$store.commit('SET_WALLET_LIST', list)
    }

    accountQuit() {
        this.$store.state.app.isInLoginPage = true
        this.$store.state.app.currentPanelIndex = 0
        this.$router.push({
            name: "login",
            params: {
                index: '2'
            }
        })
    }

    async getGenerateHash(node) {
        const that = this
        await blockchainInterface.getBlockByHeight({
            height: 1,
            node
        }).then(async (blockReasult: any) => {
            await blockReasult.result.Block.subscribe((blockInfo) => {
                that.$store.state.account.generationHash = blockInfo.generationHash
            })
        })
    }

    unconfirmedListener() {
        const node = this.node.replace('http', 'ws')
        const that = this
        this.unconfirmedTxListener && this.unconfirmedTxListener.close()
        this.unconfirmedTxListener = new Listener(node, WebSocket)
        wsInterface.listenerUnconfirmed({
            listener: this.unconfirmedTxListener,
            address: Address.createFromRawAddress(that.getWallet.address),
            fn: that.disposeUnconfirmed
        })
    }

    confirmedListener() {
        const node = this.node.replace('http', 'ws')
        const that = this
        this.confirmedTxListener && this.confirmedTxListener.close()
        this.confirmedTxListener = new Listener(node, WebSocket)
        wsInterface.listenerConfirmed({
            listener: this.confirmedTxListener,
            address: Address.createFromRawAddress(that.getWallet.address),
            fn: that.disposeConfirmed
        })
    }

    txErrorListener() {
        const node = this.node.replace('http', 'ws')
        const that = this
        this.txStatusListener && this.txStatusListener.close()
        this.txStatusListener = new Listener(node, WebSocket)
        wsInterface.listenerTxStatus({
            listener: this.txStatusListener,
            address: Address.createFromRawAddress(that.getWallet.address),
            fn: that.disposeTxStatus
        })
    }

    disposeUnconfirmed(transaction) {
        let list = this.UnconfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            this.$store.state.account.UnconfirmedTx = list
            this.$Notice.success({
                title: this.$t('Transaction_sending').toString(),
                duration: 4,
                // desc: 'hash：'+ transaction.transactionInfo.hash
            });
        }
    }

    disposeConfirmed(transaction) {
        let list = this.ConfirmedTxList
        if (!list.includes(transaction.transactionInfo.hash)) {
            list.push(transaction.transactionInfo.hash)
            this.$store.state.account.ConfirmedTx = list
            this.$Notice.success({
                title: this.$t('Transaction_Reception').toString(),
                duration: 4,
                // desc: 'hash：'+ transaction.transactionInfo.hash
            });
        }
    }

    disposeTxStatus(transaction) {
        let list = this.errorTxList
        if (!list.includes(transaction.hash)) {
            list.push(transaction.hash)
            this.$store.state.account.errorTx = list
            this.$Notice.error({
                title: transaction.status.split('_').join(' '),
                duration: 10,
                // desc: 'hash：'+ transaction.transactionInfo.hash
            });
        }
    }

    // getCurrentXem() {
    //     const {currentNode} = this
    //     const that = this
    //     const currentXEM = new NamespaceId('nem.xem')
    //     const currentXEM2 = new NamespaceId('cat.currency')
    //     this.$store.state.account.currentXEM1 = currentXEM.id.toHex()
    //     console.log(currentXEM2.id.toHex())
    // }

    initData() {
        this.languageList = this.$store.state.app.languageList
        this.currentLanguage = localRead('local')
        this.$store.state.app.local = {
            abbr: this.currentLanguage,
            language: this.$store.state.app.localMap[this.currentLanguage]
        }
        this.currentNode = this.$store.state.account.node
        this.walletList = this.getWalletList
    }

    @Watch('currentNode')
    onCurrentNode() {
        const {currentNode} = this
        this.$store.state.account.node = currentNode
        const that = this
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
        const linkedMosaic = new NamespaceHttp(currentNode).getLinkedMosaicId(new NamespaceId('nem.xem'))
        linkedMosaic.subscribe((mosaic) => {
            this.$store.state.account.currentXEM1 = mosaic.toHex();
        })
        axios.get(currentNode + '/chain/height').then(function (response) {
            that.isNodeHealthy = true
            that.getGenerateHash(currentNode)
        }).catch(function (error) {
            that.isNodeHealthy = false
        });
    }

    @Watch('getWallet')
    onGetWalletChange() {
        this.walletList = this.getWalletList
        this.currentWallet = this.getWallet.address
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
    }

    created() {
        this.windowSizeChange()
        this.initData()
        this.unconfirmedListener()
        this.confirmedListener()
        this.txErrorListener()
        // this.getCurrentXem()
    }
}
