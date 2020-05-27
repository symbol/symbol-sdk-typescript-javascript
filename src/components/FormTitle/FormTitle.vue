<template>
  <div class="form-title-container">
    <span class="form-title">
      <slot />
    </span>
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class FormTitle extends Vue {}
</script>
<style lang="less" scoped>
@import './FormTitle.less';
</style>
