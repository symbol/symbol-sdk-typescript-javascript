<template>
  <div :class="[ isWindows ? 'windows' : 'mac','wrap' ]">
    <div v-if="alert.show">
      <Alert class="alert warning_alert" type="error">
        <Icon type="ios-warning-outline" />
        {{ $t(`${alert.message}`) }}
      </Alert>
    </div>

    <PageNavigator />
    
    <div class="top_window">
      <div class="nem_logo_wrap">
        <div class="nem_logo">
          <img class="absolute" src="@/common/img/window/windowNemLogo.png" alt="">
        </div>
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <span class="pointer" @click="minWindow" />
            <span v-if="!isNowWindowMax" class="pointer not_window_max " @click="maxWindow" />
            <span v-else class="pointer now_window_max" @click="unMaximize" />
            <span class="pointer close_window" @click="closeWindow" />
          </div>
        </div>


        <div class="app_controller clear">
          <div :class="[isNodeHealthy ? 'point_healthy' : 'point_unhealthy']">
            <Spin v-if="NetworkProperties.loading" class="absolute un_click" />
            <Poptip placement="bottom-end" @on-popper-hide="refreshValidate">
              <i class="pointer point" />
              <span v-if="wallet" class="network_type_text">
                {{ nodeNetworkTypeText }}
              </span>
              <div slot="title" class="title">
                {{ $t('current_endpoint') }}：{{ node }}
              </div>
              <div slot="content">
                <div class="node_list">
                  <div class="node_list_container scroll">
                    <div
                      v-for="(iterNode, index) in nodeList"
                      :key="`sep${index}`"
                      class="point_item pointer"
                      @click="node = iterNode.value"
                    >
                      <img :src="iterNode.value === node ? monitorSelected : monitorUnselected">
                      <span class="node_url text_select">{{ iterNode.value }}</span>
                      <img
                        class="remove_icon" src="@/common/img/service/multisig/multisigDelete.png"
                        @click.stop="removeNode(iterNode.value)"
                      >
                    </div>
                  </div>

                  <form
                    class="input_point point_item"
                    action="submit"
                    onsubmit="event.preventDefault()"
                    @keyup.enter="submit"
                  >
                    <ErrorTooltip placement-override="top" class="node-input-container" field-name="friendlyNodeUrl">
                      <input
                        v-model="inputNodeValue"
                        v-validate="validation.friendlyNodeUrl"
                        :data-vv-as="$t('node')"
                        data-vv-name="friendlyNodeUrl"
                        :placeholder="$t('please_enter_a_custom_nod_address')"
                      >
                    </ErrorTooltip>
                    <span class="sure_button radius pointer" @click="submit">+</span>
                    <span
                      class="reset-icon radius pointer"
                      @click.stop="resetNodeListToDefault()"
                    >
                      <Icon type="md-refresh" />
                    </span>
                  </form>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="switch_language">
            <i-select v-model="language">
              <i-option v-for="(item, index) in languageList" :key="index" :value="item.value">
                {{ item.label }}
              </i-option>
            </i-select>
          </div>
          <div v-if="wallet && walletList.length" class="switch_wallet">
            <img class="select_wallet_icon" src="@/common/img/window/windowWalletSelect.png">
            <i-select v-model="currentWalletAddress">
              <i-option v-for="(item, index) in walletList" :key="index" :value="item.address">
                {{ item.name }}
              </i-option>
            </i-select>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import {PageLayoutTs} from '@/components/menu-bar/PageLayoutTs.ts'
import './PageLayout.common.less'
import './PageLayout.mac.less'
import './PageLayout.win32.less'

export default class PageLayout extends PageLayoutTs {

}
</script>
