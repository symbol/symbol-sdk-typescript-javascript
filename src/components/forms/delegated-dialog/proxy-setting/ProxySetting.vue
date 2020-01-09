<template>
  <div class="account-link-wrapper">
    <Modal
      class="confirm-alert-container"
      v-model="isShowAlertToConfirm"
      @on-ok="submit"
      @on-cancel="isShowAlertToConfirm=false"
      :title="$t('Are_you_sure_to_unlink_this_account')">
    </Modal>

    <div class="account-link-wrapper-title">
      <span class="title-remote-account"> {{$t(
        linkedAccountKey
          ? 'unbind_remote_account_public_key' : 'input_remote_account_publicKey'
        )}} </span>
    </div>

    <div class="remote-public-key-container">
      <form action="submit" onsubmit="event.preventDefault()" @keyup.enter="submit">
        <input
            class="remote-public-key un_click"
            :value="currentRemotePublicKey"
            disabled="true"
            v-focus
            :placeholder="$t('remote_account_being_created')"
        />
      </form>
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
      <Button type="default" @click='isShowAlertToConfirm=true'>{{$t('Unlink')}}</Button>
      <Button type="success"  @click='$emit("nextClicked")'>{{$t('next')}}</Button>
    </div>

    <div class="ready-to-link button_bottom" v-else>
      <Button type="default" @click='submit'>{{$t('Link')}}</Button>
      <Button type="success" class="gray-button" >{{$t('next')}}</Button>
    </div>
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
