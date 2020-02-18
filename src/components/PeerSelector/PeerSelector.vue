<template>
<div :class="[isConnected ? 'point_healthy' : 'point_unhealthy']">
  <Poptip placement="bottom-end">
    <i class="pointer point" />
    <span v-if="isConnected" class="network_type_text">
    {{ networkTypeText }}
    </span>
    <div slot="title" class="title">
    {{ $t('current_endpoint') }}：{{ currentPeer.url }}
    </div>
    <div slot="content">
      <div class="node_list">
        <div class="node_list_container scroll">
          <div
              v-for="(nodeUrl, index) in peersList"
              :key="`sep${index}`"
              class="point_item pointer"
              @click="switchPeer(nodeUrl)"
          >
            <img :src="currentPeer.url === nodeUrl ? imageResources.selected : imageResources.unselected">
            <span class="node_url text_select">{{ nodeUrl }}</span>
            <img
              class="remove_icon" src="@/views/resources/img/service/multisig/multisigDelete.png"
              @click.stop="removePeer(nodeUrl)">
          </div>
        </div>

        <form
          class="input_point point_item"
          action="submit"
          onsubmit="event.preventDefault()"
          @keyup.enter="addPeer"
        >
              <!-- v-validate="validationRules.friendlyNodeUrl" -->

          <ErrorTooltip placement-override="top" class="node-input-container" field-name="friendlyNodeUrl">
            <input
              v-model="formItems.nodeUrl"
              :data-vv-as="$t('node')"
              data-vv-name="friendlyNodeUrl"
              :placeholder="$t('please_enter_a_custom_nod_address')"
              >
          </ErrorTooltip>
          <span class="sure_button radius pointer" @click="addPeer">+</span>
          <span
            class="reset-icon radius pointer"
            @click.stop="resetList()"
          >
            <Icon type="md-refresh" />
          </span>
        </form>
      </div>
    </div>
  </Poptip>
</div>
</template>

<script lang="ts">
import {PeerSelectorTs} from './PeerSelectorTs'

export default class PeerSelector extends PeerSelectorTs {}
</script>
