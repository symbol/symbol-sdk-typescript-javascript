<template>
  <div class="label_page">
    <span class="page_title">{{ $t(title) }}</span>
    <span class="pointer refresh_btn" @click.stop="$emit('refresh')">
      {{ $t('refresh') }}
    </span>
  </div>
</template>

<script lang="ts">
import { PageTitleTs } from './PageTitleTs'
export default class PageTitle extends PageTitleTs {}
</script>
<style lang="less" scoped>
@import './PageTitle.less';
</style>
