<template>
  <div class="normal_set secondary_page_animate">
    <ul>
      <li>{{$t('privacy_policy')}}</li>
      <li>{{$t('terms_of_use')}}</li>
      <li>{{$t('about_us')}}</li>
    </ul>
    <div class="version">
      NEM2 Desktop wallet - v{{WALLET_VERSION}}
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    import {WALLET_VERSION} from '@/config';
    
    @Component({
      data() {
        return {WALLET_VERSION}
      }
    })
    export default class SettingAbout extends Vue {}
</script>
<style scoped lang="less">
  @import "SettingAbout.less";
</style>
