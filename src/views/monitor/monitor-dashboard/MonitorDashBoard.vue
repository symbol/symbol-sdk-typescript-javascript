<template>
  <div class="dash_board_container">
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
          <span class="value">{{t.value}}</span>
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
          {{$t('confirmed_transaction')}} ({{confirmedDataAmount}})
        </span>
        <span class="line">|</span>
        <span @click="switchTransactionPanel(false)"
              :class="['pointer',showConfirmedTransactions?'':'selected','page_title']">
          {{$t('unconfirmed_transaction')}} ({{unconfirmedDataAmount}})
        </span>
      </div>

      <div class="all_transaction">
        <div class="table_head">
          <span class="account">{{$t('account')}}</span>
          <span class="transfer_type">{{$t('transaction_type')}}</span>
          <span class="amount">{{$t('the_amount')}}</span>
          <span class="date">{{$t('date')}}</span>
        </div>
        <div class="confirmed_transactions" v-if="showConfirmedTransactions">
          <Spin v-if="isLoadingConfirmedTx" size="large" fix class="absolute"></Spin>
          <div class="table_body hide_scroll" ref="confirmedTableBody">
            <div class="table_item pointer" @click="showDialog(c)" v-for="c in currentTransactionList">
              <img class="mosaic_action" v-if="!c.isReceipt"
                   src="@/common/img/monitor/dash-board/dashboardMosaicOut.png" alt="">
              <img class="mosaic_action" v-else src="@/common/img/monitor/dash-board/dashboardMosaicIn.png"
                   alt="">
              <span class="account">{{c.oppositeAddress}}</span>
              <span class="transfer_type">{{c.isReceipt ? $t('gathering'):$t('payment')}}</span>
              <span class="mosaicId">{{c.mosaic?c.mosaic.id.toHex().toUpperCase():null}}</span>
              <span class="amount" v-if="c.mosaic">{{c.isReceipt ? '+':'-'}}{{c.mosaic.amount.compact()}}</span>
              <span v-else class="amount"> 0</span>
              <span class="date">{{c.time}}</span>
              <img src="@/common/img/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info">
            </div>
            <div class="no_data" v-if="confirmedTransactionList.length == 0">
              {{$t('no_confirmed_transactions')}}
            </div>
          </div>
        </div>

        <div class="unconfirmed_transactions" v-if="!showConfirmedTransactions">
          <Spin v-if="isLoadingUnconfirmedTx" size="large" fix class="absolute"></Spin>
          <div class="table_body hide_scroll" ref="unconfirmedTableBody">
            <div class="table_item pointer" @click="showDialog(u)" v-for="(u,index) in unconfirmedTransactionList"
                 :key="index">
              <img class="mosaic_action" v-if="u.isReceipt"
                   src="@/common/img/monitor/dash-board/dashboardMosaicOut.png" alt="">
              <img class="mosaic_action" v-else src="@/common/img/monitor/dash-board/dashboardMosaicIn.png"
                   alt="">
              <span class="account">{{u.oppositeAddress}}</span>
              <span class="transfer_type">{{u.isReceipt ? $t('gathering'):$t('payment')}}</span>
              <span class="amount">{{u.isReceipt ? '+':'-'}}{{u.mosaic.amount.compact()}}</span>
              <span class="date">{{u.time}}</span>
              <img src="@/common/img/monitor/dash-board/dashboardExpand.png"
                   class="radius expand_mosaic_info">
            </div>
            <div class="no_data" v-if="unconfirmedTransactionList.length == 0">
              {{$t('no_unconfirmed_transactions')}}
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
