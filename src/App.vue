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
        initData() {
            this.$store.state.app.walletList = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
            this.$store.state.app.isInLoginPage = true
            if(this.$store.state.app.walletList.length == 0){
                this.$router.push({
                    name: 'login'
                })
            }else {
                this.$router.push({
                    name: 'reLogin'
                })
            }
        }

        created() {
            this.initData()
            if (window['electron']) {
                const ipcRenderer = window['electron']['ipcRenderer']
                ipcRenderer.send('app', 'max')
            }
            const lock = localRead('lock')
        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
  @import "./assets/css/iview.less";
</style>
