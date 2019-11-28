<template>
  <div class="mosaicWrap selection_container">
    <div class="top_navigator radius">
      <span class="button_list_item">
        <span
          :class="['name', $route.path === '/mosaicList' ? 'active' : '', 'pointer']"
          @click="$route.path === '/mosaicList' ? '' : $router.push('mosaicList')"
        >{{$t('mosaic_list')}}</span>

        <span
          :class="['name', $route.path === '/createMosaic' ? 'active' : '', 'pointer']"
          @click="$route.path === '/createMosaic' ? '' : $router.push('createMosaic')"
        >{{$t('create_mosaic')}}</span>
      </span>
    </div>

    <div class="sub_function_container radius">
      <div class="right_panel">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "Mosaic"
};
</script>
<style scoped lang="less">
@import "Mosaic.less";
</style>
