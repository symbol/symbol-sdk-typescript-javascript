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
        <Icon :type="route.meta.icon" size="48" />
        <div>{{ route.meta.title }}</div>
      </div>
    </div>

    <div v-if="!!currentAccount" class="quit_account pointer" @click="logout">
      <img src="@/views/resources/img/window/windowAccountQuit.png" alt="">
      <span class="account_name overflow_ellipsis">{{ currentAccount.values.get('accountName') }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import {PageNavigatorTs} from './PageNavigatorTs'
import './PageNavigator.less'
import './PageNavigator.win32.less'

export default class PageNavigator extends PageNavigatorTs {}
</script>
