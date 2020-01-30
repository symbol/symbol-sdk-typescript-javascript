<template>
  <div class="top_navidator radius">
    <span
      v-for="(tabEntry, index) in tabEntries"
      :key="index"
      :class="[
        tabEntry.isActive($route) ? 'active_navigator' : '',
        'outter_container',
        'radius',
        tabEntry.isActive($route) ? 'disabled' : 'pointer'
      ]"
      @click="tabEntry.isActive($route) ? '' : $router.push({name: tabEntry.route}).catch(err => {})"
    >
      <span class="inner_container absolute">{{ $t(tabEntry.title) }}</span>
      <span class="line">|</span>
    </span>
  </div>
</template>

<script lang="ts">
import {RouterTabListTs} from './RouterTabListTs'
import './RouterTabList.less'

export default class RouterTabList extends RouterTabListTs {}
</script>
