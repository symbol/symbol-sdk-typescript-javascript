<template>
  <div class="top_navidator radius">
    <span
      v-for="({title, route, active}, index) in links"
      :key="index"
      :class="[
        active ? 'active_navigator' : '',
        'outter_container',
        'radius',
        active ? 'disabled' : 'pointer'
      ]"
      @click="active ? '' : $router.push({name: route}).catch(err => {})"
    >
      <span class="inner_container absolute">{{ $t(title) }}</span>
      <span class="line">|</span>
    </span>
  </div>
</template>

<script lang="ts">
import {RouterTabListTs} from './RouterTabListTs'
import './RouterTabList.less'

export default class RouterTabList extends RouterTabListTs {}
</script>
