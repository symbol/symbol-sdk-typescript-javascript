<template>
  <div class="wrap">
    <div class="left_navigator">
      <div class="navigator_icon">
        <div :key="index"
             :class="[$store.state.app.currentPanelIndex == index ? 'active_panel' : '',$store.state.app.isInLoginPage?'un_click':'pointer']"
             @click="switchPanel(index)"
             v-for="(a,index) in activePanelList">
          <span :class="['absolute', $store.state.app.currentPanelIndex == index ? 'active_icon' : '']"></span>
        </div>
      </div>

      <div @click="accountQuit" class="quit_account pointer"
           v-if=" !$store.state.app.isInLoginPage && $store.state.app.walletList.length !==0">
        <img src="../../assets/images/window/windowAccoutQuit.png" alt="">
        <span>Number</span>
      </div>
    </div>
    <div class="top_window">
      <div class="nem_logo_wrap">
        <div class="nem_logo">
          <img class="absolute" src="../../assets/images/window/windowNemLogo.png" alt="">
        </div>
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <span class="pointer" @click="minWindow"></span>
            <span class="pointer"></span>
            <span class="pointer" @click="closeWindow"></span>
          </div>
        </div>
        <div class="app_controller clear">
          <div :class="[isNodeHealthy?'point_healthy':'point_unhealthy']">
            <Poptip placement="bottom-end">
              <i class="pointer point" @click="toggleNodeList"></i>
              <span class="network_type_text" v-if="$store.state.account.wallet">
                {{ $store.state.account.wallet.networkType == 144 ? 'MIJIN_TEST':''}}
              </span>
              <div slot="title" class="title">{{$t('current_point')}}：{{$store.state.account.node}}</div>
              <div slot="content">
                <div @click="selectPoint(index)" class="point_item pointer" v-for="(p,index) in nodetList">
                  <img :src="p.isSelected ? monitorSeleted : monitorUnselected">
                  <span>{{p.name}} ({{p.url}})</span>
                </div>

                <div class="input_point point_item">
                  <input v-model="inputNodeValue" type="text" :placeholder="$t('please_enter_a_custom_nod_address')">
                  <span @click="changePointByInput" class="sure_button radius pointer">+</span>
                </div>

              </div>
            </Poptip>
          </div>
          <div class="switch_language">
            <i-select @on-change="switchLanguage" :model="currentLanguage"
                      :placeholder="currentLanguage ? $store.state.app.localMap[currentLanguage] : '中文'">
              <i-option v-for="item in languageList" :value="item.value">{{ item.label }}</i-option>
            </i-select>
          </div>
          <div class="switch_wallet" v-if="showSelectWallet&&walletList.length > 0">
            <img class="select_wallet_icon" src="../../assets/images/window/windowWalletSelect.png" alt="">
            <i-select @on-change="switchWallet" v-model="currentWallet" :placeholder="walletList[0].name">
              <i-option v-for="item in walletList" :value="item.address">{{ item.name }}</i-option>
            </i-select>
          </div>
        </div>
      </div>
    </div>

	<transition name="fade" mode="out-in">
+      <router-view/>
+   </transition>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator/lib/vue-property-decorator'
    import {localSave, localRead} from '../../utils/util.js'
    import routers from '@/router/routers'
    import axios from 'axios'
    import monitorSeleted from '@/assets/images/window/windowSelected.png'
    import monitorUnselected from '@/assets/images/window/windowUnselected.png'
    import {blockchainInterface} from '@/interface/sdkBlockchain.js';
    import Message from "@/message/Message";
    import {Address, Listener, NamespaceHttp, NamespaceId} from "nem2-sdk";
    import {wsInterface} from "../../interface/sdkListener";

    @Component
    export default class Home extends Vue {
        isShowNodeList = false
        inputNodeValue = ''
        nodetList = [
            {
                value: 'http://192.168.0.105:3000',
                name: 'my-8',
                url: '3.0.78.183',
                isSelected: true,
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

        get node () {
            return this.$store.state.account.node
        }

        get UnconfirmedTxList () {
            return this.$store.state.account.UnconfirmedTx
        }

        get ConfirmedTxList () {
            return this.$store.state.account.ConfirmedTx
        }
        get errorTxList () {
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

        unconfirmedListener(){
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

        confirmedListener(){
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
        txErrorListener(){
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

        disposeUnconfirmed (transaction){
            let list = this.UnconfirmedTxList
            if(!list.includes(transaction.transactionInfo.hash)){
                list.push(transaction.transactionInfo.hash)
                this.$store.state.account.UnconfirmedTx = list
                this.$Notice.success({
                    title: this.$t('Transaction_sending').toString(),
                    duration: 4,
                    // desc: 'hash：'+ transaction.transactionInfo.hash
                });
            }
        }
        disposeConfirmed (transaction){
            let list = this.ConfirmedTxList
            if(!list.includes(transaction.transactionInfo.hash)){
                list.push(transaction.transactionInfo.hash)
                this.$store.state.account.ConfirmedTx = list
                this.$Notice.success({
                    title: this.$t('Transaction_Reception').toString(),
                    duration: 4,
                    // desc: 'hash：'+ transaction.transactionInfo.hash
                });
            }
        }
        disposeTxStatus (transaction){
            let list = this.errorTxList
            if(!list.includes(transaction.hash)){
                list.push(transaction.hash)
                this.$store.state.account.errorTx = list
                this.$Notice.error({
                    title: transaction.status.split('_').join(' '),
                    duration: 10,
                    // desc: 'hash：'+ transaction.transactionInfo.hash
                });
            }
        }

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
            linkedMosaic.subscribe((mosaic)=>{
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
            this.initData()
            this.unconfirmedListener()
            this.confirmedListener()
            this.txErrorListener()
        }
    }
</script>

<style scoped lang="less">
  @import "./MenuBar.less";
</style>

