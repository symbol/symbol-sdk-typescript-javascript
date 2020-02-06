<template>
<div :class="[isConnected ? 'point_healthy' : 'point_unhealthy']">
  <Poptip placement="bottom-end" @on-popper-hide="$validator.reset()">
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
              v-for="(iterNode, index) in peersList"
              :key="`sep${index}`"
              class="point_item pointer"
              @click="switchPeer(iterNode.toURL())"
          >
            <img :src="currentPeer.url === iterNode.objects.url ? monitorSelected : monitorUnselected">
            <span class="node_url text_select">{{ iterNode.objects.url }}</span>
            <img
              class="remove_icon" src="@/views/resources/img/service/multisig/multisigDelete.png"
              @click.stop="removePeer(iterNode.objects.url)">
          </div>
        </div>

        <form
          class="input_point point_item"
          action="submit"
          onsubmit="event.preventDefault()"
          @keyup.enter="addPeer"
        >
          <ErrorTooltip placement-override="top" class="node-input-container" field-name="friendlyNodeUrl">
            <input
              v-model="formItems.nodeUrl"
              v-validate="validationRules.friendlyNodeUrl"
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
