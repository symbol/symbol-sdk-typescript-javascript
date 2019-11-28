<template>
  <div class="transaction_content secondary_page_animate" @click="hideSearchDetail()">
    <div class="left_container radius ">
      <DisabledForms></DisabledForms>
      <div class="bottom_transfer_info scroll ">
        <div class="multisig">
          <Transfer />
        </div>
      </div>
    </div>
    <CollectionRecord :transactionType="transferType.SENT" />
  </div>
</template>

<script lang="ts">
    // @ts-ignore
    import {MonitorTransferTs} from '@/views/monitor/monitor-transfer/MonitorTransferTs.ts'


    export default class MonitorTransfer extends MonitorTransferTs {

    }
</script>
<style scoped lang="less">
  @import "MonitorTransfer.less";
</style>
