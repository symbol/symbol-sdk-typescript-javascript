<template>
  <div :class="[isConnected ? 'endpoint-healthy' : 'endpoint-unhealthy']">
    <Poptip placement="bottom-end" class="endpoint-poptip" @on-popper-show="onPopTipShow">
      <i class="pointer point" />
      <span v-if="isConnected" class="network_type_text">{{ networkTypeText }}</span>
      <div slot="title" class="title">
        {{ $t('current_endpoint') }}：{{ currentPeerInfo.url }} -
        {{ currentPeerInfo.friendlyName }}
      </div>
      <div slot="content">
        <div class="inputs-container select-container">
          <form class="input_point point_item node-inputs-container">
            <input
              v-model="formItems.filter"
              :data-vv-as="$t('filter')"
              data-vv-name="filter"
              :placeholder="$t('filter_peers')"
              style="height: 100%;"
            />
          </form>
        </div>

        <div class="node_list">
          <div id="node-list-container" v-auto-scroll="'peer-selected'" class="node_list_container scroll">
            <div
              v-for="({ url, friendlyName }, index) in peersList"
              :key="`sep${index}`"
              :class="['point_item', 'pointer', { 'peer-selected': currentPeerInfo.url === url }]"
              @click="currentPeerInfo.url !== url ? switchPeer(url) : ''"
            >
              <img :src="currentPeerInfo.url === url ? imageResources.selected : imageResources.unselected" />
              <span class="node_url">{{ url }} - {{ friendlyName }}</span>
              <img
                v-if="currentPeerInfo.url !== url"
                class="remove_icon"
                src="@/views/resources/img/service/multisig/multisigDelete.png"
                @click.stop="removePeer(url)"
              />
            </div>
          </div>
          <ValidationObserver ref="observer" v-slot="{ handleSubmit }" slim>
            <form
              action="submit"
              onsubmit="event.preventDefault()"
              class="input_point point_item node-inputs-container"
              @keyup.enter="handleSubmit(addPeer)"
            >
              <ValidationProvider
                v-slot="{ errors }"
                mode="lazy"
                vid="endpoint"
                :name="$t('endpoint')"
                :rules="validationRules.url"
                tag="div"
                class="inputs-container select-container"
              >
                <ErrorTooltip :errors="errors">
                  <input
                    v-model="formItems.nodeUrl"
                    :data-vv-as="$t('endpoint')"
                    data-vv-name="endpoint"
                    :placeholder="$t('please_enter_a_custom_nod_address')"
                    style="height: 100%;"
                  />
                </ErrorTooltip>
              </ValidationProvider>
              <span class="sure_button radius pointer" @click="handleSubmit(addPeer)">+</span>
              <span class="reset-icon radius pointer" @click.stop="resetList()">
                <Icon type="md-refresh" />
              </span>
            </form>
          </ValidationObserver>
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
