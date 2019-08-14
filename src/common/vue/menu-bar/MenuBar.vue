<template>
  <div class="wrap">
    <div class="left_navigator">
      <div class="navigator_icon">
        <div :key="index"
             :class="[$store.state.app.currentPanelIndex == index ? 'active_panel' : '',$store.state.app.isInLoginPage?'un_click':'pointer']"
             @click="switchPanel(index)"
             v-for="(a,index) in activePanelList">
          <span :class="['absolute', $store.state.app.currentPanelIndex == index ? 'active_icon' : '']"></span>
        </div>
      </div>

      <div @click="accountQuit" class="quit_account pointer"
           v-if=" !$store.state.app.isInLoginPage && $store.state.app.walletList.length !==0">
        <img src="../../img/window/windowAccoutQuit.png" alt="">
        <span>Number</span>
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
            <span class="pointer" @click="maxWindow"></span>
            <span class="pointer" @click="closeWindow"></span>
          </div>
        </div>
        <div class="app_controller clear">
          <div :class="[isNodeHealthy?'point_healthy':'point_unhealthy']">
            <Poptip placement="bottom-end">
              <i class="pointer point" @click="toggleNodeList"></i>
              <span class="network_type_text" v-if="$store.state.account.wallet">
                {{ $store.state.account.wallet.networkType == 144 ? 'MIJIN_TEST':''}}
              </span>
              <div slot="title" class="title">{{$t('current_point')}}：{{$store.state.account.node}}</div>
              <div slot="content">
                <div @click="selectPoint(index)" class="point_item pointer" v-for="(p,index) in nodetList">
                  <img :src="p.isSelected ? monitorSeleted : monitorUnselected">
                  <span>{{p.name}} ({{p.url}})</span>
                </div>

                <div class="input_point point_item">
                  <input v-model="inputNodeValue" type="text" :placeholder="$t('please_enter_a_custom_nod_address')">
                  <span @click="changePointByInput" class="sure_button radius pointer">+</span>
                </div>

              </div>
            </Poptip>
          </div>
          <div class="switch_language">
            <i-select @on-change="switchLanguage" :model="currentLanguage"
                      :placeholder="currentLanguage ? $store.state.app.localMap[currentLanguage] : '中文'">
              <i-option v-for="(item, index) in languageList" :value="item.value" :key="index">{{ item.label }}
              </i-option>
            </i-select>
          </div>
          <div class="switch_wallet" v-if="showSelectWallet&&walletList.length > 0">
            <img class="select_wallet_icon" src="../../img/window/windowWalletSelect.png" alt="">
            <i-select @on-change="switchWallet" v-model="currentWallet" :placeholder="walletList[0].name">
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
    import {MenuBarTs} from './MenuBarTs'

    export default class MenuBar extends MenuBarTs {

    }
</script>

<style scoped lang="less">
  @import "./MenuBar.less";
</style>

