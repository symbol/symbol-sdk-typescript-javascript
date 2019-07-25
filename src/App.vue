<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {localRead} from './utils/util'

    @Component
    export default class App extends Vue {
        created() {
            if (window['electron']) {
                const ipcRenderer = window['electron']['ipcRenderer']
                ipcRenderer.send('app', 'max')
            }
            const lock = localRead('lock')
            if(lock){
                this.$router.push({name: 'reLogin'})
            }else {
                this.$router.push({name: 'login'})
            }

        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
  @import "./assets/css/iview.less";
</style>
