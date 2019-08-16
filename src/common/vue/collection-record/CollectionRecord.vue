<template>
  <div class="right_record radius">

    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="transfer_type">
        <span class="title">{{$t(transactionDetails[0].key)}}</span>
        <span class="value">{{$t(transactionDetails[0].value)}}</span>
      </div>
      <div>
        <div v-if="index !== 0" v-for="(t,index) in transactionDetails" class="other_info">
          <span class="title">{{$t(t.key)}}</span>
          <span class="value">{{t.value?t.value:'null'}}</span>
        </div>
      </div>
    </Modal>


    <div class="top_title">
      <span>{{transactionType == 1 ?$t('collection_record'):$t('transfer_record')}}</span>
      <div class="right" v-show="!isShowSearchDetail">
            <span class="select_date pointer">
              <div class="month_value">
                <img src="@/common/img/monitor/market/marketCalendar.png" alt="">
              <span>{{currentMonth}}</span>
              </div>
              <div class="date_selector">
                <DatePicker @on-change="changeCurrentMonth" type="month" placeholder="" :value="currentMonth"
                            style="width: 70px"></DatePicker>
              </div>
            </span>
        <span class="search_input un_click" @click.stop="showSearchDetail">
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
    <div class="bottom_transfer_record_list scroll">
      <Spin v-if="isLoadingTransactionRecord" size="large" fix></Spin>

      <div class="transaction_record_item pointer" @click="showDialog(c)" v-for="c in unConfirmedTransactionList">
        <img src="@/common/img/monitor/transaction/txUnConfirmed.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top">{{c.mosaic.id ? c.mosaic.id.id.toHex().toUpperCase().slice(0,8)+'...': "&nbsp;"}}</div>
            <div class="bottom"> {{c.time.slice(0, c.time.length - 3)}}</div>
          </div>
          <div class="right">
            <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
            <div class="bottom">
              {{c.transactionInfo && c.transactionInfo.height.compact()}}
            </div>
          </div>
        </div>
      </div>

      <div class="transaction_record_item pointer" @click="showDialog(c)" v-for="c in confirmedTransactionList">
        <img src="@/common/img/monitor/transaction/txConfirmed.png" alt="">
        <div class="flex_content">
          <div class="left left_components">
            <div class="top">{{c.mosaicName}}</div>
            <div class="bottom"> {{c.time.slice(0, c.time.length - 3)}}</div>
          </div>
          <div class="right">
            <div class="top">{{c.mosaic?c.mosaic.amount.compact():0}}</div>
            <div class="bottom">
              {{c.transactionInfo && c.transactionInfo.height.compact()}}
            </div>
          </div>
        </div>
      </div>

      <div class="no_data" v-if="confirmedTransactionList.length == 0 && !isLoadingTransactionRecord">
        {{$t('no_confirmed_transactions')}}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
    import {CollectionRecordTs} from './CollectionRecordTs'

    export default class CollectionRecord extends CollectionRecordTs {

    }
</script>
<style scoped lang="less">
  @import "CollectionRecord.less";
</style>
