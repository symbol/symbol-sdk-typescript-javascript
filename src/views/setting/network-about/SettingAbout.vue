<template>
  <div class="normal_set">
    <ul>
      <li>隐私政策</li>
      <li>使用条款</li>
      <li>关于我们</li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class SettingAbout extends Vue {


    }
</script>
<style scoped lang="less">
  @import "SettingAbout.less";
</style>
