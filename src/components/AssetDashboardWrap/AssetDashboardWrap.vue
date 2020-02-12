<template>
  <div class="asset-dashboard-main-container">
    <div class="header-container">
      <NavigationTabs direction="horizontal" :parent-route-name="parentRouteName" />
    </div>

    <div class="body-container">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue, Prop} from 'vue-property-decorator'

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'

@Component({ components: {NavigationTabs} })
export default class AssetDashboardWrap extends Vue {
  @Prop({ default: 'mosaics' }) parentRouteName: string
}
</script>

<style lang="less" scoped>
@import './AssetDashboardWrap.less';
</style>
