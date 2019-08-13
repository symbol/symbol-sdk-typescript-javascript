<template>
  <div class="apostille_history">
    <div class="bottom_table">
      <div class="table_main_head">
        <span>
          <img src="@/common/img/service/apostille/apostilleDowload.png" alt="">
          {{$t('Notarized_data_backup')}}
        </span>
        <span>
          <img src="@/common/img/service/apostille/apostilleDelete.png" alt="">{{$t('Notarized_data_backup')}}
        </span>
      </div>

      <div class="main_table radius">

        <div class="table_head">
          <span class="file_name">{{$t('file_name')}}</span>
          <span class="owner">{{$t('tag')}}</span>
          <span class="hash">hash</span>
          <span class="result">{{$t('date')}}</span>
        </div>


        <div v-if="transationList.length == 0" class="noData">
          <i><img src="@/common/img/wallet/no_data.png"></i>
          <p>{{$t('not_yet_open')}}</p>
        </div>


        <div class="table_item_list scroll">
          <div class="table_item" v-for="i in transationList">
            <span class="file_name">index.txt</span>
            <span class="owner">tag</span>
            <span class="hash">fe4e54598370789440e2fffc688c1dd92e254dd9e1f56594f02160dd3b13d40cb3fec81f04639525db23c034770f5509ec35a83f6e84c8f930bbf63ed327b506449dfadb02</span>
            <span class="result">
               2019-7-29 星期一，09:23:40 GMT
              </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {ApostilleHistoryTs} from './ApostilleHistoryTs'

    export default class ApostilleHistory extends ApostilleHistoryTs {

    }
</script>
<style scoped lang="less">
  @import "ApostilleHistory.less";
</style>
