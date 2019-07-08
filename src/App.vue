<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component
  export default class App extends Vue {
      ipcRenderer = window['electron']['ipcRenderer'];
      created(){
          this.ipcRenderer.send('app', 'max')
      }
  }
</script>

<style lang="less">
  @import "./assets/css/common.less";
</style>
