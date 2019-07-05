<template>
    <div class="wrap">
        <Button type="primary" shape="circle" @click="min">Min</Button>&nbsp;&nbsp;
        <Button type="primary" shape="circle" @click="max">Max</Button>&nbsp;&nbsp;
        <Button type="primary" shape="circle" @click="close">Quit</Button>
    </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class home extends Vue {
        close = () =>{
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.send('app', 'quit')
        }
        max = () =>{
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.send('app', 'max')
        }
        min = () =>{
            const ipcRenderer = window.electron.ipcRenderer;
            ipcRenderer.send('app', 'min')
        }
    }
</script>

<style scoped lang="less">
    .wrap{
        background-color: #fafafa;
    }
</style>
