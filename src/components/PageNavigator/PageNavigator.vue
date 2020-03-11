<template>
  <div class="left-navigator xym-outline">
    <div class="navigator-items-container">
      <div
        v-for="(route, index) in $router.getRoutes()"
        :key="index"
        :class="[
          'navigator-item-container',
          $route.matched.map(({path}) => path).includes(route.path) ? 'active' : '',
          !currentAccount ? 'un_click' : '',
        ]"
        @click="!currentAccount ? '' : $router.push({name: route.name})"
      >
        <div class="navigator-icon-container">
          <img :src="route.meta.icon" class="navigator-icon">
        </div>
        <div class="navigator-text-container">
          <div>{{ $t(route.meta.title) }}</div>
        </div>
      </div>
    </div>

    <div v-if="!!currentAccount" class="logout-item-container" @click="logout">
      <div class="navigator-item-container">
        <div class="navigator-icon-container">
          <Icon :type="'md-log-out'" class="navigator-icon" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PageNavigatorTs} from './PageNavigatorTs'
import './PageNavigator.less'
export default class PageNavigator extends PageNavigatorTs {}
</script>
