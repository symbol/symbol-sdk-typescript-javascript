<template>
  <div class="account-link-wrapper">
    <DisabledForms></DisabledForms>
    <div class="account-link-wrapper-title">
      <span class="title-remote-account"> {{$t(
        linkedAccountKey
          ? 'unbind_remote_account_public_key' : 'input_remote_account_publicKey'
        )}} </span>
    </div>
    <div class="remote-public-key-container">
      <form class="remote-input-container" action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <input
            class="remote-public-key un_click"
            :value="currentRemotePublicKey"
            disabled="true"
            v-focus
            :placeholder="$t('remote_account_being_created')"
        />
        <span @click="checkToCreateRemoteAccount" v-if="!currentRemotePublicKey" class="generate-remote-account pointer radius" >
          {{$t('generate')}}
        </span>
      </form>
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

    <div class="config-info-container">
      <div class="config-info-title">{{$t('Configuration_information')}}</div>
      <div>{{$t('Proxy_address')}}：{{linkedAccountKey||'N/A'}}</div>
      <div>{{$t('Current_status')}}：
        <span v-if="linkedAccountKey" class="green">{{$t('Linked')}}</span>
        <span v-else class="red">{{$t('Not_linked')}}
        </span></div>
    </div>
    <div class="ready-to-unlink button_bottom" v-if="linkedAccountKey">
      <Button type="default" class="gray-button" v-if="isUnconfirmedLinkTransactionExisted" >{{$t('loading')}}</Button>
      <Button type="default" v-else @click='checkBeforeTransaction'>{{$t('Unlink')}}</Button>
      <Button type="success"  @click='$emit("nextClicked")'>{{$t('next')}}</Button>
    </div>

    <div class="ready-to-link button_bottom" v-else>
      <Button type="default" class="gray-button" v-if="isUnconfirmedLinkTransactionExisted" >{{$t('loading')}}</Button>
      <Button type="default" v-else :class="currentRemotePublicKey?'':'gray-button'" @click='checkBeforeTransaction'>{{$t('Link')}}</Button>
      <Button type="success" class="gray-button" >{{$t('next')}}</Button>
    </div>

    <CheckPasswordDialog
      v-if="isShowPasswordDialog"
      :visible="isShowPasswordDialog"
      :returnPassword="true"
      dialogTitle="input_password"
      @passwordValidated="getPassword"
      @close="isShowPasswordDialog=false"
    ></CheckPasswordDialog>

  </div>
</template>

<script lang="ts">
    import {ProxySettingTs} from "@/components/forms/delegated-dialog/proxy-setting/ProxySettingTs.ts";
    import './ProxySetting.less'

    export default class ProxySetting extends ProxySettingTs {
    }
</script>

<style scoped lang="less">
</style>
