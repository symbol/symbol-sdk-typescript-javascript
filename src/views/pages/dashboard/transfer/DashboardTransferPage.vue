<template>
  <div class="transfer-container secondary_page_animate">
    <div class="transfer-inner-container scroll">
      <FormTransferTransaction />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import { DashboardTransferPageTs } from './DashboardTransferPageTs'
export default class DashboardTransferPage extends DashboardTransferPageTs {}
</script>
<style lang="less" scoped>
@import './DashboardTransferPage.less';
</style>
