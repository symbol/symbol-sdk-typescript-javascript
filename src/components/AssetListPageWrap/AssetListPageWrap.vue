<template>
  <div class="asset-list-main-container">
    <div class="left-container">
      <div class="table-title">
        <slot name="table-title" />
      </div>
      <div class="table-description">
        <slot name="table-description" />
      </div>
      <div class="table-section">
        <slot name="table-section" />
      </div>
    </div>
    <div class="right-container">
      <slot name="asset-description" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'

@Component({ components: {NavigationTabs} })
export default class AssetListPageWrap extends Vue { }
</script>

<style lang="less" scoped>
@import './AssetListPageWrap.less';
</style>
