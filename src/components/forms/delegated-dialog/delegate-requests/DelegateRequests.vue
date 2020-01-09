<template>
  <div class="activate-remote-wrapper">
    <DisabledForms></DisabledForms>
    <div class="proxy_message">
      <div class="three-dots-loading-animate" v-if="latestPersistentTransaction">
        <ThreeDotsLoading></ThreeDotsLoading>
      </div>
      <div class="link_status" v-if="latestPersistentTransaction">
        <div>
          <span>{{$t('Whether_the_transaction_has_been_confirmed')}}:</span>
          <Icon v-if="latestPersistentTransaction.isTxConfirmed" class="green" type="md-checkmark-circle"/>
          <Icon v-else class="orange" type="ios-more"/>
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
          <span class="green">{{latestPersistentTransaction.txHeader.hash}}</span>
        </div>
      </div>
    </div>

    <div class="temporary-remote-node-config">
      <div class="node-config">
        {{$t('remote_node')}}：{{temporaryRemoteNodeConfig.node}}
      </div>
      <div class="public-key-config">
        {{$t('remote_node_public_key')}} ：{{temporaryRemoteNodeConfig.publicKey}}
      </div>
    </div>
    <div class="flex-center">
      <span class="key">{{$t('fee')}}</span>
      <Select
        class="fee-select radius"
        data-vv-name="fee"
        v-model="feeSpeed"
        v-validate="'required'"
        :data-vv-as="$t('fee')"
        :placeholder="$t('fee')"
      >
        <Option
          v-for="item in defaultFees"
          :value="item.speed"
          :key="item.speed"
        >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}
        </Option>
      </Select>
    </div>
      <div class="button_bottom">
        <Button type="default" @click='$emit("backClicked")'>{{$t('Previous_step')}}</Button>
        <Button type="default" class="gray-button" v-if="isUnconfirmedDelegationRequestTransactionExisted" >{{$t('loading')}}</Button>
        <Button type="success" v-else @click='showDialogContainsFeeAndPassword=true'>{{$t('Send_request')}}</Button>
      </div>
    <CheckPasswordDialog
      v-if="showDialogContainsFeeAndPassword"
      :visible="showDialogContainsFeeAndPassword"
      :returnPassword="true"
      @passwordValidated="submit"
      @close="showDialogContainsFeeAndPassword=false"
    ></CheckPasswordDialog>
  </div>
</template>

<script lang="ts">
  import {DelegateRequestsTs} from "@/components/forms/delegated-dialog/delegate-requests/DelegateRequestsTs.ts";
  import './DelegateRequests.less'

  export default class DelegateRequests extends DelegateRequestsTs {
  }
</script>

<style scoped lang="less">
</style>
