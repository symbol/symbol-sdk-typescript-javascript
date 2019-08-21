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
    import './ServicePanel.less'
    // @ts-ignore
    import {ServicePanelTs} from '@/views/service/service-panel/ServicePanelTs.ts'

    export default class ServicePanel extends ServicePanelTs {

    }
</script>

<style scoped>

</style>
