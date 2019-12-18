<template>
  <div id="app" :class="[isWindows ? 'windows' : 'mac']">
    <router-view />
    <DisabledUiOverlay />
    <TransactionConfirmation />
    <LoadingOverlay v-if="showLoadingOverlay" />
  </div>
</template>

<script lang="ts">
import 'animate.css'
import {AppTs} from '@/app/AppTs.ts'
export default class App extends AppTs { }
</script>

<style lang="less">
@import "../common/css/common.less";
@import "../common/css/ivewWindows.less";
@import "../common/css/iviewMac.less";
</style>