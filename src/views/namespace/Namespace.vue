<template>
  <div class="namespace_container">
    <div class="top_navigator radius">
      <span class='button_list_item'>
        <span
          :class="['name', $route.path === '/namespaceList' ?'active':'','pointer']" 
          @click="$route.path === '/namespaceList' ? '' : $router.push('namespaceList')"
        >{{$t('Namespace_list')}}</span>
        <span
          :class="['name', $route.path === '/createNamespace' ?'active':'','pointer']" 
          @click="$route.path === '/createNamespace' ? '' : $router.push('createNamespace')"
        >{{$t('Create_namespace')}}</span>
        <span
          :class="['name', $route.path === '/createSubNamespace' ?'active':'','pointer']" 
          @click="$route.path === '/createSubNamespace' ? '' : $router.push('createSubNamespace')"
        >{{$t('Create_subNamespace')}}</span>
    </span>
    </div>
    <div class="sub_function_container scroll radius">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
    export default {
        name: 'namespace'
    }
</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
