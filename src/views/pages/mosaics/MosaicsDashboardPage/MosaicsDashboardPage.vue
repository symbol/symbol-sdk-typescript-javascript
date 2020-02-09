<template>
  <AssetDashboardWrap :parent-route-name="ParentRouteNames.mosaics" />
</template>


<script lang="ts">
// external dependencies
import {Component, Vue} from 'vue-property-decorator'

// internal dependencies
import {ParentRouteNames} from '@/router/ParentRouteNames'

// child components
import AssetDashboardWrap from '@/components/AssetDashboardWrap/AssetDashboardWrap.vue'

@Component({
  components: {AssetDashboardWrap},
  data() {return {ParentRouteNames}},
})
export default class MosaicsDashboardPage extends Vue {}
</script>
