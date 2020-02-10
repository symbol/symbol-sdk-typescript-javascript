<template>
  <div class="transfer-container secondary_page_animate">
    <div class="left-container scroll">
      <FormTransferTransaction />
    </div>

    <div class="right-container">
      CollectionRecord component
      <!--
      <CollectionRecord :transaction-type="transferType.SENT" />
      -->
    </div>
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {DashboardTransferPageTs} from './DashboardTransferPageTs'
import './DashboardTransferPage.less'

export default class DashboardTransferPage extends DashboardTransferPageTs {}
</script>
