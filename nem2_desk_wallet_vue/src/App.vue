<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
    import { Component, Vue } from 'vue-property-decorator';

    @Component({
        components: {},
    })
    export default class App extends Vue {

    }
</script>

<style lang="less">

</style>
