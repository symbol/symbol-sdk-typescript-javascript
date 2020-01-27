<template>
  <div class="label_page">
    <span class="page_title">{{ $t(title) }}</span>
    <span
      class="pointer refresh_btn"
      @click.stop="$emit('refresh')"
    >
      {{ $t('refresh') }}
    </span>
  </div>
</template>

<script lang="ts">
import {PageTitleTs} from './PageTitleTs'
import './PageTitle.less'

export default class PageTitle extends PageTitleTs {}
</script>
