<template>
  <div class="lock_content">
    <ul>
      <li>
        原密码
        <div class="gray_content">
          <input class="absolute" type="text" placeholder="请输入原始密码">
        </div>
      </li>
      <li>
        设置密码
        <div class="tips">本密码用于桌面钱包的锁定，一旦丢失，你将失去进入桌面钱包的权利.</div>
        <div class="gray_content">
          <input class="absolute" type="text" placeholder="请输入新的密码">
        </div>
      </li>
      <li>
        确认密码
        <div class="gray_content">
          <input class="absolute" type="text" placeholder="请再次输入新的密码">
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component
    export default class SettingLock extends Vue {


    }
</script>
<style scoped lang="less">
@import "SettingLock.less";
</style>
