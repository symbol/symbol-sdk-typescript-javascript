<template>
  <div class="wallet-harvesting-wrapper secondary_page_animate scroll">
    <div class="harvesting-pages-container radius scroll">
      <div v-if="showDelegatedData " class="harvesting-table-container">
        <div class="harvesting-table-header">
          <span class="hash">{{ $t('Harvested_Block_Hash') }}</span>
          <span class="height">{{ $t('block_height') }}</span>
          <span class="harvesting">{{ $t('Harvesting') }}</span>
          <span class="time">{{ $t('block_time') }}</span>
        </div>
        <div v-if="delegatedDataList.length" class="harvesting-table-body scroll">
          <div v-for="(d, index) in delegatedDataList" :key="index" class="harvesting-table-item radius">
            <span class="hash">{{ d.hash }}</span>
            <span class="height">{{ d.height }}</span>
            <span class="harvesting">{{ d.harvesting }}</span>
            <span class="time">{{ d.time }}</span>
            <span><img src="@/common/img/monitor/dash-board/dashboardExpand.png"></span>
          </div>
        </div>
        <div v-else class="no-data">
          {{ $t('no_data') }}
        </div>
      </div>

      <div v-else class="top_network_info">
        <div class="left-info-container">
          <img src="@/common/img/wallet/setting.png">
          <div class="steps-list">
            <span class="steps-list-item pointer" @click="switchDelegatedStep(stepMap.AccountLink)">
              <span>{{ $t('Proxy_settings') }}</span>
              <Icon v-if="linkedAddress" class="green" type="md-checkbox" />
              <Icon v-else class="red" type="md-close-circle" />
            </span>
            <span class="steps-list-item pointer" @click="switchDelegatedStep(stepMap.NodeConfig)">
              <span>{{ $t('node_configuration') }}</span>
              <Icon v-if="remoteNodeConfig" class="green" type="md-checkbox" />
              <Icon v-else class="red" type="md-close-circle" />
            </span>
            <span class="steps-list-item pointer" @click="switchDelegatedStep(stepMap.NodeLink)">
              <span>{{ $t('Benefit_Request') }}</span>
              <Icon
                v-if="linkedAddress && persistentAccountRequestTransactions
                  && persistentAccountRequestTransactions.length" class="green"
                type="md-checkbox"
              />
              <Icon v-else class="red" type="md-close-circle" />
            </span>
          </div>
          <div class="radius button pointer" @click="switchDelegatedStep(stepMap.AccountLink)">
            {{ $t('Configuration_settings') }}
          </div>
        </div>
        <div class="right-tips-container">
          <div class="description">
            <div class="wid_bord_class">
              <span class="bord_class">{{ $t('Delegated_Harvesting') }}</span>
            </div>
            <div>
              <p class="content_font">
                {{ $t('Delegated_harvesting_text_1') }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="change-view-container">
        <div class="flex-column-center pointer" @click="showDelegatedData = !showDelegatedData ">
          <img src="@/common/img/wallet/wallet-detail/change.png">
          <span>{{ $t('change_view') }}</span>
        </div>
      </div>
    </div>

    <DelegatedDialog
      v-if="showDelegatedDialog"
      :current-delegated-step="currentDelegatedStep"
      :show-dialog="showDelegatedDialog"
      @setCurrentDelegatedStep="setCurrentDelegatedStep"
      @closeDialog="showDelegatedDialog = false"
    />

    <TransactionModal
      v-if="showTransactionModal"
      :visible="showTransactionModal"
      :active-transaction="activeDelegationTransaction"
      @close="showTransactionModal = false"
    />
  </div>
</template>

<script lang="ts">
import './WalletHarvesting.less'
import {WalletHarvestingTs} from '@/views/wallet/wallet-details/wallet-function/wallet-harvesting/WalletHarvestingTs.ts'

export default class WalletHarvesting extends WalletHarvestingTs {
}
</script>

<style scoped lang="less">
</style>
