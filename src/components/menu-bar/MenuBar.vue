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

      <div class="quit_account pointer" v-if="!$store.state.account.wallet.name">
        <img src="../../assets/images/window/windowAccoutQuit.png" alt="">
        <span>{{$store.state.account.wallet.name}}</span>
      </div>
    </div>
    <div class="top_window">
      <div class="nem_logo">
        <img class="absolute" src="../../assets/images/window/windowNemLogo.png" alt="">
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <!--            <span class="pointer" @click="minWindow"></span>-->
            <!--            <span class="pointer" @click="maxWindow"></span>-->
            <!--            <span class="pointer" @click="closeWindow"></span>-->
          </div>
        </div>
        <div class="app_controller clear">
          <div :class="[isNodeHealthy?'point_healthy':'point_unhealthy']">
            <Poptip placement="bottom">
              <i class="pointer point" @click="toggleNodeList"></i>
              <div slot="title" class="title">{{$t('current_point')}}：{{$store.state.account.node}}</div>
              <div slot="content">
                <div @click="selectPoint(index)" class="point_item pointer" v-for="(p,index) in nodetList">
                  <img :src="p.isSelected ? monitorSeleted : monitorUnselected">
                  <span>{{p.name}} ({{p.url}})</span>
                </div>

                <div class="input_point point_item">
                  <input v-model="inputNodeValue" type="text" :placeholder="$t('please_enter_a_custom_nod_address')">
                  <span @click="changePointByInput" class="sure_button radius pointer">{{$t('confirm')}}</span>
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
          <div class="switch_wallet" v-if="walletList.length > 0">
            <img class="select_wallet_icon" src="../../assets/images/window/windowWalletSelect.png" alt="">
            <i-select @on-change="switchWallet" :model="currentWallet" :placeholder="walletList[0].name">
              <i-option v-for="item in walletList" :value="item.address">{{ item.name }}</i-option>
            </i-select>
          </div>
        </div>
      </div>
    </div>

    <div class="right_content">
      <router-view/>
    </div>

  </div>
</template>

<script lang="ts">
    import {Component, Vue, Watch} from 'vue-property-decorator/lib/vue-property-decorator'
    import {localSave, localRead} from '../../utils/util.js'
    import routers from '../../router/routers'
    import axios from 'axios'
    import monitorSeleted from '@/assets/images/monitor/monitorSeleted.png'
    import monitorUnselected from '@/assets/images/monitor/monitorUnselected.png'
    import {blockchainInterface} from '@/interface/sdkBlockchain.js';

    @Component
    export default class Home extends Vue {
        isShowNodeList = false
        inputNodeValue = ''
        nodetList = [
            {
                value: 'http://3.0.78.183:3000',
                name: 'my-8',
                url: '3.0.78.183',
                isSelected: true,
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
        monitorSeleted = monitorSeleted
        monitorUnselected = monitorUnselected
        currentNode = ''
        isNodeHealthy = true

        accountPrivateKey = ''
        accountPublicKey = ''
        accountAddress = ''
        walletList: any[] = []


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
                this.$Message.error(this['$t']('point_null_error'))
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
            console.log('routers', routers)
            const routerIcon = routers[0].children

            this.$router.push({
                params: {},
                name: routerIcon[index].name
            })
            console.log('jump to ' + routerIcon[index].name)
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
            walletList.every((item) => {
                if(item.address == address){
                    that.$store.state.account.wallet = item
                    return false
                }
                return true
            })


        }

        initData() {
            this.languageList = this.$store.state.app.languageList
            this.currentLanguage = localRead('local')
            this.$store.state.app.local = {
                abbr: this.currentLanguage,
                language: this.$store.state.app.localMap[this.currentLanguage]
            }
            this.currentNode = this.$store.state.account.node
            this.walletList = this.$store.state.app.walletList
        }

        @Watch('currentNode')
        onCurrentNode() {
            const {currentNode} = this
            this.$store.state.account.node = currentNode
            const that = this
            axios.get(currentNode + '/chain/height').then(function (response) {
                that.isNodeHealthy = true
                that.getGenerateHash(currentNode)
            }).catch(function (error) {
                that.isNodeHealthy = false
            });
        }

        async getGenerateHash(node) {
            const that = this
            let {accountPrivateKey, accountPublicKey, accountAddress} = this
            await blockchainInterface.getBlockByHeight({
                height: 1,
                node
            }).then(async (blockReasult: any) => {
                await blockReasult.result.Block.subscribe((blockInfo) => {
                    that.$store.state.account.generationHash = blockInfo.generationHash
                })
            }).catch(() => {
                console.log('generationHash  null')
            })
        }

        created() {
            this.initData()
        }
    }
</script>

<style scoped lang="less">
  @import "./MenuBar.less";
</style>

