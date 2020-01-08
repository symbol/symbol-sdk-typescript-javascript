<template>
  <div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue, Prop, Watch} from 'vue-property-decorator'

    @Component
    export default class ThreeDotsLoading extends Vue {


    }
</script>
<style scoped lang="less">
  @import "ThreeDotsLoading";
</style>
