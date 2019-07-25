<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {localSave, localRead} from '@/utils/util.js'

    @Component
    export default class App extends Vue {
        initData() {
            this.$store.state.app.walletList = localRead('wallets') ? JSON.parse(localRead('wallets')) : []
            this.$store.state.app.isInLoginPage = true
        }

        created() {
            this.initData()
            if (window['electron']) {
                const ipcRenderer = window['electron']['ipcRenderer']
                ipcRenderer.send('app', 'max')
            }
            this.$router.push({
                // name: 'servicePanel'
                name: 'login'
                // name: 'monitorPanel'
            })
        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
  @import "./assets/css/iview.less";
</style>
