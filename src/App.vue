<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class App extends Vue {
        ;

        created() {
            if (window['electron']) {
                const ipcRenderer = window['electron']['ipcRenderer']
                ipcRenderer.send('app', 'max')
            }
            this.$router.push({
                name: 'dashBoard'
            })
        }
    }
</script>

<style lang="less">
  @import "./assets/css/common.less";
</style>
