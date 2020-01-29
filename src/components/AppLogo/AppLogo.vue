<template>
  <div class="nem_logo_wrap">
    <div class="nem_logo">
      <img class="absolute" :src="logo" alt="appTitle">
    </div>
  </div>
</template>

<script lang="ts">
import {AppLogoTs} from './AppLogoTs'
import './AppLogo.less'

export default class AppLogo extends AppLogoTs {}
</script>
