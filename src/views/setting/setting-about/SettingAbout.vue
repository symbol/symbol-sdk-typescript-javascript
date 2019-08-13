<template>
  <div class="normal_set">
    <ul>
      <li>{{$t('privacy_policy')}}</li>
      <li>{{$t('terms_of_use')}}</li>
      <li>{{$t('about_us')}}</li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {SettingAboutTs} from './SettingAboutTs'

    export default class SettingAbout extends SettingAboutTs {

    }
</script>
<style scoped lang="less">
  @import "SettingAbout.less";
</style>
