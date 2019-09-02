<template>
  <div class="transaction_content secondary_page_animate" @click="hideSearchDetail()">
    <div class="left_container radius ">
      <div class="top_transfer_type">
        <span
                @click="swicthTransferType(index)"
                :class="['transaction_btn',t.isSelect?'selected_button':'', t.disabled?'disabled_button':'pointer']"
                v-for="(t,index) in transferTypeList">{{$t(t.name)}}
        </span>
      </div>
      <div class="bottom_transfer_info scroll ">
        <div class="transfer" v-if="transferTypeList[0].isSelect">
          <TransferTransaction></TransferTransaction>
        </div>

        <div class="multisig" v-if="transferTypeList[1].isSelect">
          <MultisigTransferTransaction></MultisigTransferTransaction>
        </div>
      </div>
    </div>
    <CollectionRecord :transactionType="TransferType.SENDED"></CollectionRecord>
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
