<template>
  <div class="namespace_container">
    <div class="top_navigator radius">
      <span class="button_list_item">
        <span
          :class="[ 'name', $route.name === 'namespaces.index' ? 'active' : '','pointer' ]" 
          @click="$route.name === 'namespaces.index' ? '' : $router.push({name: 'namespaces.index'})"
        >{{ $t('Namespace_list') }}</span>
        <span
          :class="[ 'name', $route.name === 'namespaces.createRoot' ? 'active' : '','pointer' ]" 
          @click="$route.name === 'namespaces.createRoot' ? '' : $router.push({name: 'namespaces.createRoot'})"
        >{{ $t('Create_namespace') }}</span>
        <span
          :class="[ 'name', $route.name === 'namespaces.createSub' ? 'active' : '','pointer' ]" 
          @click="$route.name === 'namespaces.createSub' ? '' : $router.push({name: 'namespaces.createSub'})"
        >{{ $t('Create_subNamespace') }}</span>
      </span>
    </div>
    <div class="sub_function_container scroll radius">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Namespace',
}
</script>

<style scoped lang="less">
  @import "Namespace.less";
</style>
