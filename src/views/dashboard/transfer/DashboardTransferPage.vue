<template>
  <div class="transaction_content secondary_page_animate">
    <div class="left_container radius ">
      <DisabledFormOverlay />
      <div class="bottom_transfer_info scroll ">
        <div class="multisig">
          <FormTransferCreation />
        </div>
      </div>
    </div>
    <!--
    <CollectionRecord :transaction-type="transferType.SENT" />
    -->
  </div>
</template>

<script lang="ts">
// @ts-ignore
import {DashboardTransferPageTs} from '@/views/dashboard/transfer/DashboardTransferPageTs.ts'
import "./DashboardTransferPage.less";

export default class DashboardTransferPage extends DashboardTransferPageTs {}
</script>
