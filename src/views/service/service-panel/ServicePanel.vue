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
    import {ServicePanelTs} from './ServicePanelTs'

    export default class ServicePanel extends ServicePanelTs {

    }
</script>

<style scoped>

</style>
