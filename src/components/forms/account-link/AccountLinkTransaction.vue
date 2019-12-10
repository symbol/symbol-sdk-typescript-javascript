<template>
  <Modal
    :title="$t('remote_replay')"
    v-model="show"
    :transfer="false"
    class-name="dash_board_dialog text_select"
  >
    <DisabledForms />

    <!-- LINK TO REMOTE ACCOUNT -->
    <div v-if="!wallet.isLinked()">
      <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <div class="gray_input_content">
          <span class="title">{{$t('remote_modal_pul')}}</span>
            <input
              v-focus
              type="text"
              :placeholder="$t('remote_modal_place1')"
              v-model="remotePublicKey"
              disabled
            />
        </div>

        <div class="gray_input_content">
          <span class="title">{{$t('fee')}}</span>
          <span class="type value radius flex_center">
            <Select
              data-vv-name="mosaic"
              v-model="formItems.feeSpeed"
              v-validate="'required'"
              :data-vv-as="$t('fee')"
              :placeholder="$t('fee')"
            >
              <Option
                v-for="item in defaultFees"
                :value="item.speed"
                :key="item.speed"
              >{{$t(item.speed)}} {{ `(${item.value} ${networkCurrency.ticker})` }}</Option>
            </Select>
          </span>
        </div>

        <div class="new_model_btn">
          <span class="modal_btn pointer radius" @click="submit">{{$t('send')}}</span>
        </div>
      </form>
    </div>

    <!-- UNLINK FROM REMOTE ACCOUNT -->
    <div v-if="wallet.isLinked()">
      <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <div class="gray_input_content">
          <span class="title" v-focus>{{$t('Unlink')}}</span>
          <span>{{this.wallet.address}} ({{this.wallet.name}})</span>
        </div>
        <div class="gray_input_content">
          <span class="title" v-focus>{{$t('from')}}</span>
          <span>{{this.linkedAccountKey}}</span>
        </div>
        <div class="new_model_btn">
          <span class="modal_btn pointer radius" @click="submit">{{$t('remote_modal_confirm')}}</span>
        </div>
      </form>
    </div>
  </Modal>
</template>

<script lang="ts">
import { AccountLinkTransactionTs } from "./AccountLinkTransactionTs";
export default class AccountLinkTransaction extends AccountLinkTransactionTs {}
</script>
<style lang="less">
@import "AccountLinkTransaction.less";
</style>
