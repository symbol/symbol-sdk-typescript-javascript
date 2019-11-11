<template>
  <div class="right_record radius">
    <TransactionModal
      :visible="showDialog"
      :activeTransaction="activeTransaction"
      @close="showDialog = false"
    />

    <div class="top_title">
      <span>{{transactionType === transferType.RECEIVED
          ? $t('collection_record') : $t('transfer_sent')}}</span>
      <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date pointer">
              <div class="month_value">
                <img src="@/common/img/monitor/market/marketCalendar.png" alt="">
              <span>{{ displayedDate }}</span>
              </div>
              <div class="date_selector">
                <DatePicker
                    v-model="chosenDate"
                    type="month"
                    placeholder=""
                    style="width: 70px"
                />
              </div>
            </span>
        <span class="search_input un_click" @click.stop="">
              <img src="@/common/img/monitor/market/marketSearch.png" alt="">
              <span>{{$t('search')}}</span>
            </span>
      </div>
      <div v-show="isShowSearchDetail" class="search_expand">
            <span class="search_container">
              <img src="@/common/img/monitor/market/marketSearch.png" alt="">
              <input @click.stop type="text" class="absolute" v-model="transactionHash"
                     :placeholder="$t('enter_asset_type_alias_or_address_search')">
            </span>
        <span class="search_btn pointer " @click.stop="searchByasset">{{$t('search')}}</span>
      </div>
    </div>

    <!-- @TODO: merge this block with the confirmed transaction one -->
    <div :class="['bottom_transfer_record_list','scroll']">
      <Spin v-if="transactionsLoading" size="large" fix />
      <div
              v-for="(c, index) in unConfirmedTransactionList"
              :key="`${index}ucf`"
              class="transaction_record_item pointer"
              @click="showDialog = true; activeTransaction = c"
      >
        <img src="@/common/img/monitor/transaction/txUnConfirmed.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top overflow_ellipsis">{{ renderMosaicNames(c.rawTx.mosaics, $store) }}</div>
            <div class="bottom overflow_ellipsis"> {{c.txHeader.time.slice(0, c.txHeader.time.length - 3)}}</div>
          </div>
          <div class="right">
            <div class="top overflow_ellipsis">{{ renderMosaicAmount(c.rawTx.mosaics, mosaicList, $store) }}</div>
            <div class="bottom overflow_ellipsis">
              {{formatNumber(c.txHeader.block)}}
            </div>
          </div>
        </div>
      </div>

      <div
              v-for="(c, index) in slicedConfirmedTransactionList"
              :key="`${index}cf`"
              class="transaction_record_item pointer"
              @click="showDialog = true; activeTransaction = c"
      >
        <img src="@/common/img/monitor/transaction/txConfirmed.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top overflow_ellipsis">{{ renderMosaicNames(c.rawTx.mosaics, $store) }}</div>
            <div class="bottom overflow_ellipsis"> {{c.txHeader.time.slice(0, c.txHeader.time.length - 3)}}</div>
          </div>
          <div class="right">
            <div class="top overflow_ellipsis">{{ renderMosaicAmount(c.rawTx.mosaics, mosaicList, $store) }}</div>
            <div class="bottom overflow_ellipsis">
              {{formatNumber(c.txHeader.block)}}
            </div>
          </div>
        </div>
      </div>

      <div class="no_data" v-if="slicedConfirmedTransactionList.length == 0 && !transactionsLoading">
        {{$t('no_confirmed_transactions')}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {CollectionRecordTs} from '@/components/collection-record/CollectionRecordTs.ts'
    export default class CollectionRecord extends CollectionRecordTs {
    }
</script>
<style scoped lang="less">
  @import "CollectionRecord.less";
</style>
