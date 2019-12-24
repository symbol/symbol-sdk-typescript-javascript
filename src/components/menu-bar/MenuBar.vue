<template>
  <div :class="[isWindows?'windows':'mac','wrap']">
    <div v-if="isNodeHealthy && NetworkProperties.networkType && networkType">
      <Alert class="alert warning_alert"
             v-if="NetworkProperties.networkType !== NetworkType[networkType] "
             type="error">
        <Icon type="ios-warning-outline"/>
        {{$t('Wallet_network_type_does_not_match_current_network_type')}}
      </Alert>
    </div>

    <div v-if="!isNodeHealthy">
      <Alert class="alert error_alert" type="error">
        <Icon type="md-close"/>
        {{$t('Node_not_available_please_check_your_node_or_network_settings')}}
      </Alert>
    </div>

    <div class="left_navigator">
      <div class="navigator_icon">
        <div v-for="(route, index) in routes"
             :key="index"
             :class="[ $route.matched.map(({path}) => path).includes(route.path) ? 'active_panel' : '',
              !walletList.length ? 'un_click' : 'pointer']"
             @click=" !walletList.length ?'': $router.push(route.path)">
          <span :style="$route.matched.map(({path}) => path).includes(route.path)
              ? { backgroundImage: `url('${route.meta.activeIcon}')` }
              : { backgroundImage: `url('${route.meta.icon}')` }"
                class="absolute"
          />
        </div>
      </div>

      <div @click="accountQuit" class="quit_account pointer" v-if="walletList.length !==0">
        <img src="@/common/img/window/windowAccountQuit.png" alt="">
        <span class="account_name overflow_ellipsis">{{accountName}}</span>
      </div>
    </div>
    <div class="top_window">
      <div class="nem_logo_wrap">
        <div class="nem_logo">
          <img class="absolute" src="@/common/img/window/windowNemLogo.png" alt="">
        </div>
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <span class="pointer" @click="minWindow"></span>
            <span class="pointer not_window_max " v-if="!isNowWindowMax" @click="maxWindow"></span>
            <span class="pointer now_window_max" v-else @click="unMaximize"></span>
            <span class="pointer close_window" @click="closeWindow"></span>
          </div>
        </div>


        <div class="app_controller clear">
          <div :class="[isNodeHealthy?'point_healthy':'point_unhealthy']">
            <Spin class="absolute un_click" v-if="NetworkProperties.loading"></Spin>
            <Poptip @on-popper-hide="refreshValidate" placement="bottom-end">
              <i class="pointer point"/>
              <span class="network_type_text" v-if="wallet">
                {{ nodeNetworkTypeText }}
              </span>
              <div slot="title" class="title">{{$t('current_endpoint')}}：{{node}}</div>
              <div slot="content">
                <div class="node_list">
                  <div class="node_list_container scroll">
                    <div
                      class="point_item pointer"
                      v-for="(iterNode, index) in nodeList"
                      :key="`sep${index}`"
                      @click="node = iterNode.value"
                    >
                      <img :src="iterNode.value === node? monitorSelected : monitorUnselected">
                      <span class="node_url text_select">{{iterNode.value}}</span>
                      <img class="remove_icon" @click.stop="removeNode(node)"
                           src="@/common/img/service/multisig/multisigDelete.png">
                    </div>
                    <!-- <span @click="resetNodeListToDefault">RESET NODE LIST TO DEFAULT</span> -->
                  </div>

                  <form
                    class="input_point point_item"
                    action="submit"
                    onsubmit="event.preventDefault()"
                    @keyup.enter="submit"
                  >
                    <ErrorTooltip placementOverride="top" class="node-input-container" fieldName="friendlyNodeUrl">
                      <input
                        v-validate="validation.friendlyNodeUrl"
                        :data-vv-as="$t('node')"
                        data-vv-name="friendlyNodeUrl"
                        v-model="inputNodeValue"
                        :placeholder="$t('please_enter_a_custom_nod_address')"
                      >
                    </ErrorTooltip>
                    <span @click="submit" class="sure_button radius pointer">+</span>
                    <span class="reset-icon radius pointer" @click.stop="resetNodeListToDefault()"><Icon type="md-refresh" /></span>

                  </form>
                </div>
              </div>
            </Poptip>
          </div>
          <div class="switch_language">
            <i-select v-model="language">
              <i-option v-for="(item, index) in languageList" :value="item.value" :key="index">{{ item.label }}
              </i-option>
            </i-select>
          </div>
          <div class="switch_wallet" v-if="wallet && walletList.length">
            <img class="select_wallet_icon" src="@/common/img/window/windowWalletSelect.png">
            <i-select v-model="currentWalletAddress">
              <i-option v-for="(item, index) in walletList" :value="item.address" :key="index">{{ item.name }}
              </i-option>
            </i-select>
          </div>
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view/>
    </transition>
  </div>
</template>

<script lang="ts">
    import {MenuBarTs} from '@/components/menu-bar/MenuBarTs.ts'
    import "./MenuCommon.less"
    import "./MenuBarMac.less"
    import "./MenuBarWindows.less"

    export default class MenuBar extends MenuBarTs {

    }
</script>
