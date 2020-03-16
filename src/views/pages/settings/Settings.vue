<template>
  <div class="settings-outer-container">
    <div class="settings-inner-container xym-outline">
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
  </div>
</template>

<script>
import {SettingsTs} from './SettingsTs'

export default class Settings extends SettingsTs {}
</script>

<style lang="less" scoped>
@import './Settings.less';
</style>
