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
      <AppLogo />

      <div class="controller">
        <WindowControls />

        <div class="app_controller clear">
          <div @click="hasDebugConsoleModal = true" class="debug-console-trigger">
            <Icon :type="'ios-code-working'" size="18" />
            <span>Debug</span>
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
import './PageLayout.win32.less'

export default class PageLayout extends PageLayoutTs {}
</script>
