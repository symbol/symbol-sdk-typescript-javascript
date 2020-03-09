<template>
  <div :class="[isConnected ? 'endpoint-healthy' : 'endpoint-unhealthy']">
    <Poptip placement="bottom-end" class="endpoint-poptip">
      <i class="pointer point" />
      <span v-if="isConnected" class="network_type_text">{{ networkTypeText }}</span>
      <div slot="title" class="title">
        {{ $t('current_endpoint') }}：{{ currentPeer.url }}
      </div>
      <div slot="content">
        <div class="node_list">
          <div id="node-list-container" class="node_list_container scroll">
            <div
              v-for="(nodeUrl, index) in peersList"
              :key="`sep${index}`"
              class="point_item pointer"
              @click="currentPeer.url !== nodeUrl ? switchPeer(nodeUrl) : ''"
            >
              <img
                :src="currentPeer.url === nodeUrl ? imageResources.selected : imageResources.unselected"
              >
              <span class="node_url">{{ nodeUrl }}</span>
              <img
                v-if="currentPeer.url !== nodeUrl"
                class="remove_icon"
                src="@/views/resources/img/service/multisig/multisigDelete.png"
                @click.stop="removePeer(nodeUrl)"
              >
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
                    style="height: 100%"
                  >
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

<style lang="less">
.node-inputs-container {
  width: 100%;
  height: 0.5rem;
  display: grid !important;
  grid-template-rows: 100%;
  grid-template-columns: auto repeat(2, 0.5rem);
  padding: 0.1rem 0 0 0 !important;
  margin: 0 !important;
}

.endpoint-poptip {
  .ivu-poptip-body-content {
    overflow: hidden;
  }
}
</style>
