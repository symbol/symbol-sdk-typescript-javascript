<template>
    <div class="wrap">
        <Button type="primary" @click="min">Min</Button>&nbsp;&nbsp;
        <Button type="primary" @click="max">Max</Button>&nbsp;&nbsp;
        <Button type="primary" @click="close">Quit</Button>
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
        button{
            font-size: 14px;
        }
    }
</style>
