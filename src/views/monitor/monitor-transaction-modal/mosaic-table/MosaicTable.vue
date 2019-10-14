<template>
  <div class="mosaic_table_container radius">
    <div class="table_head column_item">
      <span class="index data_item overflow_ellipsis"></span>
      <span :class="['data_item ','overflow_ellipsis',head]" v-for="head in tableData.head">{{head}}</span>
    </div>

    <div class=" table_body scroll" v-if="(typeof tableData.data) !== 'string'">
      <div :class="['column_item',judgeIfWalletIsMosaicCreator(dataItem.hex)?'green':'']" v-for="(dataItem,index) in tableData.data">
        <span class="index data_item overflow_ellipsis">{{index+1}}</span>
        <span :class="['data_item ','overflow_ellipsis','text_select',head]" v-for="head in tableData.head">{{dataItem[head]}}</span>
      </div>
    </div>
    <div class="loading" v-else>
      loading...
    </div>

  </div>
</template>

<script lang="ts">

    import {MosaicTableTs} from '@/views/monitor/monitor-transaction-modal/mosaic-table/MosaicTableTs.ts'

    export default class MosaicTable extends MosaicTableTs {

    }
</script>
<style scoped lang="less">
  @import "MosaicTable.less";
</style>
