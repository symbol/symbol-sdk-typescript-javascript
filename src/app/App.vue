<template>
  <div id="app" :class="[isWindows ? 'windows' : 'mac']">
    <router-view />
    <DisabledUiOverlay />
    <SpinnerLoading v-if="hasLoadingOverlay" />
  </div>
</template>

<script lang="ts">
import 'animate.css'
import {AppTs} from '@/app/AppTs.ts'
export default class App extends AppTs { }
</script>

<style lang="less">
@import "../views/resources/css/common.less";
@import "../views/resources/css/ivewWindows.less";
@import "../views/resources/css/iviewMac.less";
</style>
