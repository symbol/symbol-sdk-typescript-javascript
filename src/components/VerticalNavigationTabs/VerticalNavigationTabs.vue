<template>
  <div class="vertical-tabs-container">
    <span
      v-for="(tabEntry, index) in tabEntries"
      :key="index"
      :class="[
        'tab-item',
        tabEntry.isActive($route) ? 'active' : '',
      ]"
      @click="tabEntry.isActive($route)
        ? '' : $router.push({name: tabEntry.route}).catch(err => {})"
    >
      {{ $t(tabEntry.title) }}
    </span>
  </div>
</template>

<script lang="ts">
import {VerticalNavigationTabsTs} from './VerticalNavigationTabsTs'
import './VerticalNavigationTabs.less'

export default class VerticalNavigationTabs extends VerticalNavigationTabsTs {}
</script>
