<template>
  <div class="dash_board_container">
    <Modal
            :title="$t('transaction_detail')"
            v-model="isShowDialog"
            :transfer="false"
            class-name="dash_board_dialog">
      <div class="transfer_type">
        <span class="title">{{$t('transfer_type')}}</span>
        <span class="value">{{$t(transactionDetails.transfer_type)}}</span>
      </div>
      <div>
        <div v-if="key !=='transfer_type'" v-for="(value,key,index) in transactionDetails" class="other_info">
          <span class="title">{{$t(key)}}</span>
          <span class="value">{{value}}</span>
        </div>
      </div>
    </Modal>

    <div class="top_network_info">
      <div class="left_echart radius">
        <span class="trend">{{$t('XEM_market_trend_nearly_7_days')}}</span>
        <span class="right">
          <span>{{$t('The_total_market_capitalization')}}（USD）</span>
          <span class="black">{{currentPrice}}</span>
        </span>
        <LineChart></LineChart>
      </div>
      <div class="right_net_status radius">
        <div class="panel_name">{{$t('network_status')}}</div>

        <div class="network_item radius" v-for="(n,index) in networkStatusList">
          <img :src="n.icon" alt="">
          <span class="descript">{{$t(n.descript)}}</span>
          <span :class="['data','overflow_ellipsis', updateAnimation]">
            <numberGrow v-if="index !== 4" :value="$store.state.app.chainStatus[n.variable]"></numberGrow>
            <span v-else>...{{$store.state.app.chainStatus[n.variable].substr(-5,5)}}</span>
          </span>
        </div>
      </div>
    </div>

    <div class="bottom_transactions radius scroll" ref="bottomTransactions">
      <div class="splite_page">
        <span>{{$t('total')}}：{{currentDataAmount}} {{$t('data')}}</span>
        <Page @on-change="changePage" :total="currentDataAmount" class="page_content"/>
      </div>

      <div class="label_page">
        <span @click="switchTransactionPanel(true)"
              :class="['pointer',showConfirmedTransactions?'selected':'','page_title']">
          {{$t('transfer_record')}} ({{transferListLength}})
        </span>
        <span class="line">|</span>
        <span @click="switchTransactionPanel(false)"
              :class="['pointer',showConfirmedTransactions?'':'selected','page_title']">
          {{$t('receipt')}} ({{receiptListLength}})
        </span>
      </div>

      <div class="table_container" v-if="showConfirmedTransactions">
        <div class="all_transaction">
          <div class="table_head">
            <span class="account">{{$t('account')}}</span>
            <span class="transfer_type">{{$t('asset_type')}}</span>
            <span class="amount">{{$t('the_amount')}}</span>
            <span class="date">{{$t('date')}}</span>
          </div>
          <div class="confirmed_transactions">
            <Spin v-if="isLoadingTransactions" size="large" fix class="absolute"></Spin>
            <div class="table_body hide_scroll" ref="confirmedTableBody">
              <div class="table_item pointer" @click="showDialog(c)" v-for="c in currentTransactionList">
                <img class="mosaic_action" v-if="!c.isReceipt"
                     src="@/common/img/monitor/dash-board/dashboardMosaicOut.png" alt="">
                <img class="mosaic_action" v-else src="@/common/img/monitor/dash-board/dashboardMosaicIn.png"
                     alt="">
                <span class="account overflow_ellipsis">{{c.infoFirst}}</span>
                <span class="transfer_type overflow_ellipsis">{{c.infoSecond?c.infoSecond:null}}</span>
                <span :class="['amount','overflow_ellipsis',!c.isReceipt?'orange':'blue']" v-if="c.infoThird">{{c.infoThird}}</span>
                <span v-else class="amount overflow_ellipsis"> 0</span>
                <span class="date overflow_ellipsis">{{c.time}}</span>
                <img v-if="c.isTxUnconfirmed" src="@/common/img/monitor/dash-board/dashboardUnconfirmed.png"
                     class="expand_mosaic_info">
                <img v-else src="@/common/img/monitor/dash-board/dashboardConfirmed.png"
                     class="expand_mosaic_info">
              </div>
              <div class="no_data" v-if="transferTransactionList.length == 0">
                {{$t('no_confirmed_transactions')}}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table_container_unconfirmed table_container" v-if="!showConfirmedTransactions">
        <div class="all_transaction">
          <div class="table_head">
            <span class="account">{{$t('transaction_type')}}</span>
            <span class="transfer_type">{{$t('remote_modal_price')}}(Gas)</span>
            <span class="amount">{{$t('block')}}</span>
            <span class="date">{{$t('date')}}</span>
          </div>
          <div class="unconfirmed_transactions">
            <Spin v-if="isLoadingTransactions" size="large" fix class="absolute"></Spin>
            <div class="table_body hide_scroll" ref="unconfirmedTableBody">
              <div class="table_item pointer" @click="showDialog(u)" v-for="(u,index) in receiptList"
                   :key="index">
                <img class="mosaic_action"
                     :src="u.icon" alt="">
                <span class="account overflow_ellipsis">{{$t(u.tag)}}</span>
                <span class="transfer_type overflow_ellipsis">{{u.infoSecond}}</span>
                <span class="amount overflow_ellipsis">{{u.infoThird}}</span>
                <span class="date overflow_ellipsis">{{u.time}}</span>
                <img v-if="u.isTxUnconfirmed" src="@/common/img/monitor/dash-board/dashboardUnconfirmed.png"
                     class="expand_mosaic_info">
                <img v-else src="@/common/img/monitor/dash-board/dashboardConfirmed.png"
                     class="expand_mosaic_info">
              </div>
              <div class="no_data" v-if="receiptList.length == 0">
                {{$t('no_unconfirmed_transactions')}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

    import {MonitorDashBoardTs} from './MonitorDashBoardTs'

    export default class DashBoard extends MonitorDashBoardTs {

    }
</script>

<style scoped lang="less">
  @import "MonitorDashBoard.less";
</style>
