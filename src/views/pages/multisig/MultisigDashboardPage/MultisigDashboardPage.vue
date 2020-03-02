<template>
  <div class="multisig-dashboard-main-container">
    <div class="header-container">
      <NavigationTabs direction="horizontal" :parent-route-name="'multisig'" />
    </div>

    <div class="body-container">
      <router-view />
    </div>
  </div>
</template>
<script>
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'

@Component({ 
  components: {NavigationTabs},
  data() {return {}},
})
export default class MultisigDashboardPage extends Vue {}
</script>

<style lang="less" scoped>
.multisig-dashboard-main-container {
  position: relative;
  width: 100%;
  height: 100%;
  padding: 0.2rem 0 0.35rem 0;
  display: grid;
  grid-template-columns: 100%;
  grid-template-rows: 0.6rem auto;

  .header-container {
    width: 100%;
    height: 100%;
  }

  .body-container {
    border-radius: 4px;
  }
}
</style>
