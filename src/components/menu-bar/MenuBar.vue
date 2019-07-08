<template>
  <div class="wrap">
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
              中文
            </div>
            <div class="switch_wallet">
              test Wallet
            </div>
          </div>
        </div>
      </div>

      <div class="main_container">
        <div class="left_navigator">
            <div :key="index" :class="a ? 'active_panel' : ''" @click="switchPanel(index)" v-for="(a,index) in activePanelList">
            <span :class="['absolute', a ? 'active_icon' : '']"></span>
          </div>
        </div>
      </div>

    </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator/lib/vue-property-decorator';

  @Component
  export default class Home extends Vue {
    activePanelList = [true,false,false,false,false]
    closeWindow() {
      const ipcRenderer = window.electron.ipcRenderer;
      ipcRenderer.send('app', 'quit')
    }
    maxWindow() {
      const ipcRenderer = window.electron.ipcRenderer;
      ipcRenderer.send('app', 'max')
    }
    minWindow() {
      const ipcRenderer = window.electron.ipcRenderer;
      ipcRenderer.send('app', 'min')
    }
    switchPanel (index){
      this.activePanelList = [false,false,false,false,false]
        this.activePanelList[index] = true
    }
  }
</script>

<style scoped lang="less">
    @import "./MenuBar.less";
</style>

