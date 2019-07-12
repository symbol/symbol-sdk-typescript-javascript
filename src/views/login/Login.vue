<template>
  <div class="login_content outer_panel">
    <div class="left_banner">
      <LoginBanner></LoginBanner>
    </div>
    <div class="right_login">
      <div class="program_controller">
        <span @click="minWindow"></span>
        <span @click="maxWindow"></span>
        <span @click="closeWindow"></span>
      </div>
      <router-view/>
    </div>
  </div>
</template>

<script>
  import LoginBanner from './LoginBanner.vue'
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    components: {
      LoginBanner
    }
  })
  export default class Login extends Vue {

    minWindow() {
      if (window.require) {
        var ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('min')
      }
    }

    maxWindow() {
      if (window.require) {
        var ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('max')
      }
    }

    closeWindow() {
      if (window.require) {
        var ipcRenderer = window.require('electron').ipcRenderer
        ipcRenderer.send('quit')
      }

    }
  }
</script>

<style scoped lang="less">
  @import "Login.less";
</style>
