<template>
  <div class="app-logo-container">
    <img :src="logo" alt="appTitle" />
  </div>
</template>

<script lang="ts">
import { AppLogoTs } from './AppLogoTs'
export default class AppLogo extends AppLogoTs {}
</script>
<style lang="less" scoped>
@import './AppLogo.less';
</style>
