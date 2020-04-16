<template>
  <div class="mac wrap">
    <div v-if="alert.show">
      <Alert class="alert warning_alert" type="error">
        <Icon type="ios-warning-outline" />
        {{ $t(`${alert.message}`) }}
      </Alert>
    </div>
    <div v-else-if="info.show">
      <Alert class="alert success_alert" type="success">
        <Icon type="ios-bulb-outline" />
        {{ $t(`${info.message}`) }}
      </Alert>
    </div>

    <PageNavigator v-if="!$route.matched.map(({name}) => name).includes('accounts')" />

    <div class="top_window">
      <AppLogo />

      <div class="controller">
        <WindowControls />

        <div class="app_controller clear">
          <div class="debug-console-trigger" @click="hasDebugConsoleModal = true">
            <Icon :type="'ios-code-working'" size="22" class="debug-console-trigger-icon" />
            <span>&nbsp;{{ $t('top_window_console') }}</span>
          </div>

          <PeerSelector />
          <LanguageSelector />
          <WalletSelectorField @input="onChangeWallet" />
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <div class="main-outer-container">
        <router-view />
      </div>
    </transition>

    <ModalDebugConsole
      v-if="hasDebugConsoleModal"
      :visible="hasDebugConsoleModal"
      :title="$t('modal_title_debug_console')"
      @close="hasDebugConsoleModal = false"
    />
  </div>
</template>

<script lang="ts">
import { PageLayoutTs } from './PageLayoutTs'
import './PageLayout.common.less'
import './PageLayout.mac.less'

export default class PageLayout extends PageLayoutTs {}
</script>
