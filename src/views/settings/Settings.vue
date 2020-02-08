<template>
  <div class="main-container radius">
    <div class="left-container">
      <NavigationTabs direction="vertical" :parent-route-name="parentRouteName" />
    </div>
    <div class="right-container">
      <FormTitle style="form-containers">
        {{ $t($route.meta.title) }}
      </FormTitle>
      <router-view />
    </div>
  </div>
</template>

<script>
import {SettingsTs} from './SettingsTs'
import './Settings.less'

export default class Settings extends SettingsTs {}
</script>
