<template>
  <div class="wrap">
    <div class="left_navigator">
      <div class="navigator_icon">
        <div :key="index" :class="a ? 'active_panel' : ''" @click="switchPanel(index)"
             v-for="(a,index) in activePanelList">
          <span :class="['absolute', a ? 'active_icon' : '']"></span>
        </div>
      </div>


      <div class="quit_account">
        <img src="../../assets/images/window/window_accout_quit.png" alt="">
        <span>账户名</span>
      </div>
    </div>
    <div class="top_window">
      <div class="nem_logo">
        <img class="absolute" src="../../assets/images/window/window_nem_logo.png" alt="">
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <span @click="minWindow"></span>
            <span @click="maxWindow"></span>
            <span @click="closeWindow"></span>
          </div>
        </div>
        <div class="app_controller clear">
          <div class="point_health">
            <i></i>
          </div>
          <div class="switch_language">
            <i-select @on-change="switchLanguage" :model="currentLanguage"  :placeholder="currentLanguage ? $store.state.app.localMap[currentLanguage] : '中文'">
              <i-option v-for="item in languageList" :value="item.value">{{ item.label }}</i-option>
            </i-select>
          </div>
          <div class="switch_wallet">
            <img class="select_wallet_icon" src="../../assets/images/window/window_wallet_select.png" alt="">
            <i-select @on-change="switchWallet" :model="currentWallet"  placeholder="wallet-1">
              <i-option v-for="item in walletList" :value="item.value">{{ item.label }}</i-option>
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
    import {Component, Vue} from 'vue-property-decorator/lib/vue-property-decorator';
    import routers from '../../router/routers';
    import { localSave, localRead } from '../../utils/util.js';

    @Component
    export default class Home extends Vue {
        activePanelList = [true, false, false, false, false]
        currentLanguage =  false
        languageList = [
            {
                value: 'zh-CN',
                label: '中文'
            },{
                value: 'en-US',
                label: '英语'
            },
        ]
        currentWallet = ''
        walletList = [
            {
                value: 'wallet1',
                label: 'wallet-1'
            }, {
                value: 'wallet12',
                label: 'wallet-2'
            }
        ]
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

        switchPanel(index) {
            this.$router.push({
                params:{},
                name:routers[0].children[index].name
            })
            console.log('jump to '+ routers[0].children[index].name)
            this.activePanelList = [false, false, false, false, false]
            this.activePanelList[index] = true
        }
        switchLanguage(language) {
            const { app } = this.$store.state
            app.local = {
                abbr: language,
                language: app.localMap[language]
            }
            localSave('local',language)
        }
        switchWallet(walletNmae) {
            console.log('switch wallet', walletNmae)
        }
        created() {
            this.currentLanguage = localRead('local')
        }
    }
</script>

<style scoped lang="less">
  @import "./MenuBar.less";
</style>

