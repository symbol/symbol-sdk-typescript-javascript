<template>
  <div class="setting_container scroll radius selection_container">
    <div class="top_navigator radius">
      <span class='button_list_item'>
        <span
          :class="['name', $route.path === '/multisigConversion' ?'active':'','pointer']"
          @click="$router.push('multisigConversion')"
        >{{$t('convert')}}</span>
        <span
          :class="['name', $route.path === '/multisigManagement' ?'active':'','pointer']"
          @click="$router.push('multisigManagement')"
        >{{$t('manage')}}</span>
        <span
          :class="['name', $route.path === '/multisigCosign' ?'active':'','pointer']"
          @click="$router.push('multisigCosign')"
        >{{$t('cosign_transactions')}}</span>
        <span
          :class="['name', $route.path === '/multisigMap' ?'active':'','pointer']"
          @click="$router.push('multisigMap')"
        >{{$t('map')}}</span>
      </span>
    </div>

    <div class="sub_function_container ">
      <router-view />
    </div>
  </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator'
    export default class Multisig extends Vue {}
</script>
<style scoped lang="less">
  @import "Multisig.less";
</style>
