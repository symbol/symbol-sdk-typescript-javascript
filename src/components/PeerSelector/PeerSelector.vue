<template>
  <div :class="[isConnected ? 'endpoint-healthy' : 'endpoint-unhealthy']">
    <Poptip v-model="poptipVisible" placement="bottom-end" class="endpoint-poptip" @on-popper-show="onPopTipShow">
      <i class="pointer point" />
      <span v-if="isConnected" class="network-text pointer">{{ $t(networkTypeText) }}</span>
      <div slot="content" class="node-selector-container">
        <div class="current-node-info">
          <Row>
            <i-col span="6">{{ $t('current_network') }}:</i-col>
            <i-col span="18">{{ networkTypeText }}</i-col>
          </Row>
          <Row>
            <i-col span="6">{{ $t('current_endpoint') }}:</i-col>
            <i-col span="18" class="overflow_ellipsis" :title="currentPeerInfo.url + currentPeerInfo.friendlyName">
              {{ currentPeerInfo.url }} - {{ currentPeerInfo.friendlyName }}</i-col
            >
          </Row>
        </div>
        <div class="node-list-container">
          <div class="node-list-head">
            <span>{{ $t('node_list') }}</span
            ><span>({{ peersList.length }})</span>
          </div>
          <div class="node-list-content">
            <ul v-auto-scroll="'active'">
              <li
                v-for="({ url, friendlyName }, index) in peersList"
                :key="`sep${index}`"
                class="list-item pointer"
                :class="[{ active: currentPeerInfo.url == url }]"
                @click="currentPeerInfo.url !== url ? switchPeer(url) : ''"
              >
                <div class="node-url overflow_ellipsis" :title="url + friendlyName">{{ url }}-{{ friendlyName }}</div>
              </li>
            </ul>
          </div>
          <div class="node-list-text">
            <Icon type="ios-help-circle-outline" /><span
              >You can use the <a @click="goSetting()">Settings</a> page for node management or to configure a new
              network</span
            >
          </div>
        </div>
      </div>
    </Poptip>
  </div>
</template>

<script lang="ts">
import { PeerSelectorTs } from './PeerSelectorTs'

export default class PeerSelector extends PeerSelectorTs {}
</script>

<style lang="less" scoped>
@import './PeerSelector.less';
</style>
