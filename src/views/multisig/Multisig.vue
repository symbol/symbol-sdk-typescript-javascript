<template>
  <div class="setting_container scroll radius selection_container">
    <div class="top_navigator radius">
      <span class='button_list_item'>
        <span
          :class="['name', $route.path === '/multisigConversion' ?'active':'','pointer']"
          @click="$route.path === '/multisigConversion' ? '' : $router.push('multisigConversion')"
        >{{$t('convert')}}</span>
        <span
          :class="['name', $route.path === '/multisigManagement' ?'active':'','pointer']"
          @click="$route.path === '/multisigManagement' ? '' : $router.push('multisigManagement')"
        >{{$t('manage')}}</span>
        <span
          :class="['name', $route.path === '/multisigCosign' ?'active':'','pointer']"
          @click="$route.path === '/multisigCosign' ? '' : $router.push('multisigCosign')"
        >{{$t('cosign_transactions')}}</span>
      </span>
    </div>

    <div class="sub_function_container ">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    @Component
    export default class Multisig extends Vue {}
</script>
<style scoped lang="less">
  @import "Multisig.less";
</style>
