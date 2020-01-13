<template>
  <div class="persistent-delegation-request-wrapper">
    <form
      action="submit" onsubmit="event.preventDefault()"
      class="form-style"
      @keyup.enter="submit"
    >
      <div class="account-link-wrapper-title">
        {{ $t('input_remote_node') }}
      </div>
      <div class="flex-column-center">
        <ErrorTooltip placement-override="top" class="node-input-container" field-name="friendlyNodeUrl">
          <AutoComplete
            v-model="chosenNode"
            v-validate="validation.friendlyNodeUrl"
            :data-vv-as="$t('node')"
            data-vv-name="friendlyNodeUrl"
            :placeholder="$t('please_enter_a_custom_nod_address')"
            :data="defaultNodeList"
            icon="md-arrow-dropdown"
          />
        </ErrorTooltip>
        <span class="node-network-type radius flex-column-center pointer" @click="searchNodeInfo">
          <img class="refresh-icon" src="@/common/img/wallet/wallet-detail/refresh.png">
          {{ $t('test_node') }}
        </span>
      </div>
      <div class="proxy_message config-container">
        <p class="text1">
          {{ $t('Configuration_information') }}
        </p>
        <p class="text2">
          {{ $t('Remote_node_for_harvesting') }}：{{ chosenNode }}
        </p>
        <p class="text2">
          {{ $t('remote_node_public_key') }}：
          <span v-if="nodePublicKey.value" class="green">   {{ nodePublicKey.label }}</span>
          <span v-else class="red">{{ nodePublicKey.label }}</span>
        </p>
        <p class="text2">
          {{ $t('Remote_node_status') }}:
          <span v-if="nodePublicKey.value" class="green">{{ $t('Online') }}</span>
          <span v-else class="red">{{ $t('Unreachable') }}</span>
        </p>
      </div>
      <div class="button_bottom">
        <Button @click="$emit(&quot;backClicked&quot;)">
          {{ $t('Previous_step') }}
        </Button>
        <Button type="success" @click="submit">
          {{ $t('next') }}
        </Button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {NetworkSettingTs} from '@/components/forms/delegated-dialog/network-setting/NetworkSettingTs.ts'
import './NetworkSetting.less'

export default class NetworkSetting extends NetworkSettingTs {
}
</script>

<style scoped lang="less">
</style>
