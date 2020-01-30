<template>
  <div class="left_navigator">
    <div class="navigator_icon">
      <div
        v-for="(route, index) in $router.getRoutes()"
        :key="index"
        :class="[ $route.matched.map(({path}) => path).includes(route.path) ? 'active_panel' : '',
                  !currentAccount ? 'un_click' : 'pointer' ]"
        @click="!currentAccount ? '' : $router.push({name: route.name})"
      >
        <span
          :style="$route.matched.map(({path}) => path).includes(route.path)
            ? { backgroundImage: `url('${route.meta.activeIcon}')` }
            : { backgroundImage: `url('${route.meta.icon}')` }"
          class="absolute"
        />
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
