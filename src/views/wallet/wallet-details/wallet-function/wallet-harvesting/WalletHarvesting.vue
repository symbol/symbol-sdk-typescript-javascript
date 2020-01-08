<template>
  <div class="wallet-harvesting-wrapper secondary_page_animate scroll">
    <div class="harvesting-pages-container radius scroll">

      <div v-if="showDelegatedData " class="harvesting-table-container">
        <div class="harvesting-table-header">
          <span class="hash">{{$t('Harvested_Block_Hash')}}</span>
          <span class="height">{{$t('block_height')}}</span>
          <span class="harvesting">{{$t('Harvesting')}}</span>
          <span class="time">{{$t('block_time')}}</span>
        </div>
        <div class="harvesting-table-body scroll" v-if="delegatedDataList.length">
          <div class="harvesting-table-item radius" v-for="d in delegatedDataList">
            <span class="hash">{{d.hash}}</span>
            <span class="height">{{d.height}}</span>
            <span class="harvesting">{{d.harvesting}}</span>
            <span class="time">{{d.time}}</span>
            <span><img src="@/common/img/monitor/dash-board/dashboardExpand.png"></span>
          </div>
        </div>
        <div class="no-data" v-else>{{$t('no_data')}}</div>
      </div>

      <div class="top_network_info" v-else>
            <div class="left-info-container">
              <img src="@/common/img/wallet/walletDeleteIcon.png">
              <div class="steps-list">
                <span @click="switchDelegatedStep(stepMap.AccountLink)" class="steps-list-item pointer">
                  <span>{{$t('Proxy_settings')}}</span>
                  <Icon class="green" v-if="linkedAddress" type="md-checkbox"/>
                  <Icon class="red" v-else type="md-close-circle"/>
                </span>
                <span @click="switchDelegatedStep(stepMap.NodeConfig)" class="steps-list-item pointer">
                  <span>{{$t('node_configuration')}}</span>
                  <Icon class="green" v-if="remoteNodeConfig" type="md-checkbox"/>
                  <Icon class="red" v-else type="md-close-circle"/>
                </span>
                <span @click="switchDelegatedStep(stepMap.NodeLink)" class="steps-list-item pointer">
                  <span>{{$t('Benefit_Request')}}</span>
                  <Icon class="green" v-if="linkedAddress && persistentAccountRequestTransactions && persistentAccountRequestTransactions.length"
                        type="md-checkbox"/>
                  <Icon class="red" v-else type="md-close-circle"/>
                </span>
              </div>
              <div class="radius button pointer" @click="switchDelegatedStep(stepMap.AccountLink)">{{$t('Configuration_settings')}}</div>

            </div>
            <div class="right-tips-container">
              <div class="description">
                <div class="wid_bord_class">
                  <span class="bord_class">{{$t('Delegated_Harvesting')}}</span>
                </div>
                <div>
                  <p class="content_font">{{$t('Delegated_Harvesting_answer')}}</p>
                </div>
              </div>
            </div>
      </div>
      <div class="change-view-container">
        <div class="flex-column-center pointer" @click="showDelegatedData = !showDelegatedData ">
          <img src="@/common/img/wallet/wallet-detail/change.png">
          <span>{{$t('change_view')}}</span>
        </div>
      </div>
    </div>

    <DelegatedDialog v-if="showDelegatedDialog"
                     :currentDelegatedStep="currentDelegatedStep"
                     :showDialog="showDelegatedDialog"
                     @setCurrentDelegatedStep="setCurrentDelegatedStep"
                     @closeDialog="showDelegatedDialog=false"
    ></DelegatedDialog>

    <DelegatedCheckPasswordDialog v-if="isShowPasswordDialog"
                                  :showDialog="isShowPasswordDialog"
                                  @closeDialog="isShowPasswordDialog=false"
                                  @passwordCallBack="showDelegatedDialog=true"
    ></DelegatedCheckPasswordDialog>

    <TransactionModal v-if="showTransactionModal"
                      :visible="showTransactionModal"
                      :activeTransaction="activeDelegationTransaction"
                      @close="showTransactionModal = false"
    />
  </div>
</template>

<script lang="ts">
    import "./WalletHarvesting.less";
    import {WalletHarvestingTs} from "@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvestingTs.ts";

    export default class WalletHarvesting extends WalletHarvestingTs {
    }
</script>

<style scoped lang="less">
</style>
