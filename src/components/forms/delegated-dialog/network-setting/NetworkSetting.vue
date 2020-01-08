<template>
  <div class="persistent-delegation-request-wrapper">
    <form action="submit" onsubmit="event.preventDefault()"
          @keyup.enter="submit"
          class="form-style">
      <div class="account-link-wrapper-title">
        {{$t('input_remote_node')}}
      </div>
      <div class="flex-column-center">
        <ErrorTooltip placementOverride="top" class="node-input-container" fieldName="friendlyNodeUrl">
          <AutoComplete
            v-validate="validation.friendlyNodeUrl"
            :data-vv-as="$t('node')"
            data-vv-name="friendlyNodeUrl"
            v-model="chosenNode"
            :placeholder="$t('please_enter_a_custom_nod_address')"
            :data="defaultNodeList"
            icon="md-arrow-dropdown"
          ></AutoComplete>
        </ErrorTooltip>
        <span class="node-network-type radius flex-column-center pointer" @click="searchNodeInfo">
           <img class="refresh-icon" src="@/common/img/wallet/wallet-detail/refresh.png" >
            {{$t('test_node')}}
        </span>
      </div>
      <div class="proxy_message config-container">
        <p class="text1">{{$t('Configuration_information')}}</p>
        <p class="text2">{{$t('Remote_node_for_harvesting')}}：{{chosenNode}}</p>
        <p class="text2">{{$t('remote_node_public_key')}}：
          <span class="green" v-if="nodePublicKey.value">   {{nodePublicKey.label}}</span>
          <span class="red" v-else>{{nodePublicKey.label}}</span>

        </p>
        <p class="text2">{{$t('Remote_node_status')}}:
          <span class="green" v-if="nodePublicKey.value">{{$t('Online')}}</span>
          <span class="red" v-else>{{$t('Unreachable')}}</span>
        </p>
      </div>
      <div class="button_bottom">
        <Button @click='$emit("backClicked")'>{{$t('Previous_step')}}</Button>
        <Button type="success" @click="submit">{{$t('next')}}</Button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
  import {NetworkSettingTs} from "@/components/forms/delegated-dialog/network-setting/NetworkSettingTs.ts";
  import './NetworkSetting.less'

  export default class NetworkSetting extends NetworkSettingTs {
  }
</script>

<style scoped lang="less">
</style>
