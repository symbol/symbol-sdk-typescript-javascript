<template>
  <div class="asset-form-main-container">
    <div class="left-container xym-outline">
      <div class="form-section">
        <slot name="form-section" />
      </div>
    </div>
    <div class="right-container xym-outline">
      <slot name="form-description" />
    </div>
  </div>
</template>

<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue'

@Component({ components: {NavigationTabs} })
export default class AssetFormPageWrap extends Vue { }
</script>

<style lang="less" scoped>
@import './AssetFormPageWrap.less';
</style>

<style scoped> 
</style>
