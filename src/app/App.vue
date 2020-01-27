<template>
  <div id="app" :class="[isWindows ? 'windows' : 'mac']">
    <router-view />
    <DisabledUiOverlay />
    <ModalTransactionConfirmation />
    <SpinnerLoading v-if="hasLoadingOverlay" />
  </div>
</template>

<script lang="ts">
import 'animate.css'
import {AppTs} from '@/app/AppTs.ts'
export default class App extends AppTs { }
</script>

<style lang="less">
@import "@/public/css/common.less";
@import "@/public/css/ivewWindows.less";
@import "@/public/css/iviewMac.less";
</style>
