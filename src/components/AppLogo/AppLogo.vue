<template>
  <div class="app-logo-container">
    <img :src="logo" alt="appTitle">
  </div>
</template>

<script lang="ts">
import {AppLogoTs} from './AppLogoTs'
import './AppLogo.less'

export default class AppLogo extends AppLogoTs {}
</script>
