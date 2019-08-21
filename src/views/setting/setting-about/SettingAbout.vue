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
    // @ts-ignore
    import {SettingAboutTs} from '@/views/setting/setting-about/SettingAboutTs.ts'

    export default class SettingAbout extends SettingAboutTs {

    }
</script>
<style scoped lang="less">
  @import "SettingAbout.less";
</style>
