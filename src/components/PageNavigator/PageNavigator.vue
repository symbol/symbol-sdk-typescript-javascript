<template>
  <div class="left_navigator xym-outline">
    <div class="navigator-item">
      <div
        v-for="(route, index) in $router.getRoutes()"
        :key="index"
        :class="[ $route.matched.map(({path}) => path).includes(route.path) ? 'active' : '',
                  !currentAccount ? 'un_click' : 'pointer', 'body' ]"
        @click="!currentAccount ? '' : $router.push({name: route.name})"
      >
        <Icon :type="route.meta.icon" size="38" />
        <div>{{ route.meta.title }}</div>
      </div>
    </div>

    <div v-if="!!currentAccount" class="quit_account navigator-item" @click="logout">
      <div class="body pointer">
        <Icon :type="'md-log-out'" size="38" />
        <div>{{ currentAccount.values.get('accountName') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {PageNavigatorTs} from './PageNavigatorTs'
import './PageNavigator.less'
import './PageNavigator.win32.less'

export default class PageNavigator extends PageNavigatorTs {}
</script>
