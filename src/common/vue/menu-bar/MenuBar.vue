<template>
  <div :class="[isWindows?'windows':'mac','wrap']">
    <Alert class="alert" v-if="!isNodeHealthy" type="error">
      <Icon type="ios-alert-outline"/>
      {{$t('Node_not_available_please_check_your_node_or_network_settings')}}
    </Alert>

    <div class="left_navigator">
      <div class="navigator_icon">
        <div :key="index"
             :class="[currentPanelIndex == index ? 'active_panel' : '',!walletList.length?'un_click':'pointer']"
             @click="switchPanel(index)"
             v-for="(a,index) in activePanelList">
          <span :class="['absolute', currentPanelIndex == index ? 'active_icon' : '']"></span>
        </div>
      </div>

      <div @click="accountQuit" class="quit_account pointer"
           v-if="walletList.length !==0">
        <img src="../../img/window/windowAccoutQuit.png" alt="">
        <span>Nember</span>
      </div>
    </div>
    <div class="top_window">
      <div class="nem_logo_wrap">
        <div class="nem_logo">
          <img class="absolute" src="../../img/window/windowNemLogo.png" alt="">
        </div>
      </div>
      <div class="controller">
        <div class="window_controller">
          <div>
            <span class="pointer" @click="minWindow"></span>
            <span class="pointer not_window_max " v-if="!isNowWindowMax" @click="maxWindow"></span>
            <span class="pointer now_window_max" v-else @click="maxWindow"></span>
            <span class="pointer" @click="closeWindow"></span>
          </div>
        </div>
        <div class="app_controller clear">
          <div :class="[isNodeHealthy?'point_healthy':'point_unhealthy']">
            <Poptip placement="bottom-end">
              <i class="pointer point" @click="toggleNodeList"/>
              <span class="network_type_text" v-if="wallet">
                {{ networkType == 144 ? 'MIJIN_TEST':''}}
              </span>
              <div slot="title" class="title">{{$t('current_point')}}：{{node}}</div>
              <div slot="content">
                <div
                        @click="selectEndpoint(index)"
                        class="point_item pointer"
                        v-for="(p,index) in nodeList"
                        :key="`sep${index}`"
                >
                  <img :src="p.isSelected ? monitorSeleted : monitorUnselected">
                  <span>{{p.name}} ({{p.url}})</span>
                </div>

                <div class="input_point point_item">
                  <input v-model="inputNodeValue" type="text" :placeholder="$t('please_enter_a_custom_nod_address')">
                  <span @click="changeEndpointByInput" class="sure_button radius pointer">+</span>
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
            <img class="select_wallet_icon" src="../../img/window/windowWalletSelect.png" alt="">
            <i-select v-model="currentWalletAddress" :placeholder="walletList[0].name">
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
    import {MenuBarTs} from '@/common/vue/menu-bar/MenuBarTs.ts';

    export default class MenuBar extends MenuBarTs {

    }
</script>

<style scoped lang="less">
  @import "./MenuBarWindows.less";
  @import "./MenuBarMac.less";
</style>

