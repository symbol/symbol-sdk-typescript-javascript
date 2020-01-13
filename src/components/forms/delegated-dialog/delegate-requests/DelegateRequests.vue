<template>
  <div class="activate-remote-wrapper">
    <DisabledForms />
    <div class="proxy_message">
      <div v-if="latestPersistentTransaction" class="three-dots-loading-animate">
        <ThreeDotsLoading />
      </div>
      <div v-if="latestPersistentTransaction" class="link_status">
        <div>
          <span>{{ $t('Whether_the_transaction_has_been_confirmed') }}:</span>
          <Icon v-if="latestPersistentTransaction.isTxConfirmed" class="green" type="md-checkmark-circle" />
          <Icon v-else class="orange" type="ios-more" />
        </div>
        <!--        @todo update it after we can get harvester data from node-->
        <!--        <div>-->
        <!--          <span>{{$t('Whether_the_revenue_transaction_has_been_successful')}}:</span>-->
        <!--          <span>-->
        <!--            <Icon class="orange" type="ios-more"/>-->
        <!--          </span>-->
        <!--        </div>-->
        <div class="transaction-hash">
          <span>Hash:</span>
          <span class="green">{{ latestPersistentTransaction.txHeader.hash }}</span>
        </div>
      </div>
    </div>

    <div class="temporary-remote-node-config">
      <div class="node-config">
        {{ $t('remote_node') }}：{{ temporaryRemoteNodeConfig.node }}
      </div>
      <div class="public-key-config">
        {{ $t('remote_node_public_key') }} ：{{ temporaryRemoteNodeConfig.publicKey }}
      </div>
    </div>
    <div class="flex-center">
      <span class="key">{{ $t('fee') }}</span>
      <Select
        v-model="feeSpeed"
        v-validate="'required'"
        class="fee-select radius"
        data-vv-name="fee"
        :data-vv-as="$t('fee')"
        :placeholder="$t('fee')"
      >
        <Option
          v-for="item in defaultFees"
          :key="item.speed"
          :value="item.speed"
        >
          {{ $t(item.speed) }} {{ `(${item.value} ${networkCurrency.ticker})` }}
        </Option>
      </Select>
    </div>
    <div class="button_bottom">
      <Button type="default" @click="$emit(&quot;backClicked&quot;)">
        {{ $t('Previous_step') }}
      </Button>
      <Button v-if="isUnconfirmedDelegationRequestTransactionExisted" type="default" class="gray-button">
        {{ $t('loading') }}
      </Button>
      <Button v-else type="success" @click="showDialogContainsFeeAndPassword = true">
        {{ $t('Send_request') }}
      </Button>
    </div>
    <CheckPasswordDialog
      v-if="showDialogContainsFeeAndPassword"
      :visible="showDialogContainsFeeAndPassword"
      :return-password="true"
      @passwordValidated="submit"
      @close="showDialogContainsFeeAndPassword = false"
    />
  </div>
</template>

<script lang="ts">
import {DelegateRequestsTs} from '@/components/forms/delegated-dialog/delegate-requests/DelegateRequestsTs.ts'
import './DelegateRequests.less'

export default class DelegateRequests extends DelegateRequestsTs {
}
</script>

<style scoped lang="less">
</style>
