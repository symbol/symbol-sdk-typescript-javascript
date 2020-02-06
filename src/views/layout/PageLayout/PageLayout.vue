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
          <PeerSelector />
          <LanguageSelector />
          <WalletSelectorField />
        </div>
      </div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view />
    </transition>
  </div>
</template>

<script lang="ts">
import {PageLayoutTs} from './PageLayoutTs'
import './PageLayout.common.less'
import './PageLayout.mac.less'
import './PageLayout.win32.less'

export default class PageLayout extends PageLayoutTs {

}
</script>
