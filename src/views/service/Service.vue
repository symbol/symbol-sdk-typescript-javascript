<template>
  <div class="servicePanelWrap clear">
    <div class="left serviceSwitch">
      <ServiceSwitch></ServiceSwitch>
    </div>
    <div class="left serviceFn">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
    import './Service.less'
    // @ts-ignore
    import {ServiceTs} from 'src/views/service/ServiceTs.ts'

    export default class Service extends ServiceTs {

    }
</script>

<style scoped>

</style>
