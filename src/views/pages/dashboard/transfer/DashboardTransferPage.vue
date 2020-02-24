<template>
  <div class="transfer-container secondary_page_animate">
    <div class="transfer-inner-container scroll">
      <FormTransferTransaction />
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {DashboardTransferPageTs} from './DashboardTransferPageTs'
import './DashboardTransferPage.less'

export default class DashboardTransferPage extends DashboardTransferPageTs {}
</script>
